// only business logic intregrated in services

import mongoose, { SortOrder } from "mongoose";
import config from "../../../config";
import { paginationHelper } from "../../../helper/paginationHelper";
import {
  IGenericResponse,
  IPagniationOptions,
} from "../../../shared/interfaces";
import { IUser, IUserFilters } from "./users.interface";
import { User } from "./users.model";

import { usersSearchableFiels } from "../../../constants/user";
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
  generateSuperAdminId,
} from "./users.utils";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import {
  IAcademicSemester,
  IAcademicSemesterCode,
} from "../academicSemester/academicSemester.interface";
import { IStudent } from "../student/interface";
import { Student } from "../student/model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import byt from "bcrypt";
import { IFaculty } from "../faculty/interface";
import { Faculty } from "../faculty/model";
import { Admin } from "../admin/model";
import { IAdmin } from "../admin/interface";
import { RedisClient } from "../../../shared/redis";
import { EVENT_ADMIN_CREATED, EVENT_FACULTY_CREATED, EVENT_STUDENT_CREATED, EVENT_SUPER_ADMIN_CREATE_RESPONSE, EVENT_SUPER_ADMIN_CREATED } from "./users.constats";
import { ISuperAdmin } from "../super-admin/interface";
import { SuperAdmin } from "../super-admin/model";

const createStudent = async (
  student: IStudent,
  user: Partial<IUser>
): Promise<IUser | null> => {
  if (!user.password) {
    user.password = config.default_st_pass as string;
  }

 
  
  user.role = "student";
  const academicSemester = await AcademicSemester.findById(
    student.academicSemester
  );

  let newUserData = null;

  // const session = await mongoose.startSession()
  // try {
  //     session.startTransaction()
  //     const id =  await generateStudentId({year:academicSemester?.year,code:academicSemester?.code})
  //     user.id = id
  //     student.id = id

  //     const newStudent = await Student.create([student],{session})

  //     if(!newStudent.length){
  //         throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create student')
  //     }

  //     console.log(newStudent)
  //     user.student = newStudent[0]._id;
  //     const newUser = await User.create([user],{session})
  //     if(!newUser.length){
  //         throw new ApiError(httpStatus.BAD_REQUEST,'User not created')
  //     }

  //     newUserData = newUser[0]

  //     await session.commitTransaction()
  //     await session.endSession()

  // } catch (error) {
  //     console.error('Error during transaction:', error);
  //     await session.abortTransaction()
  //     await session.endSession()
  //     throw error;
  // }

  // transaction feature of mongodb applicable only on MongoDB replica set or sharded cluster (mongos)
  try {
    const id = await generateStudentId({
      year: academicSemester?.year,
      code: academicSemester?.code,
    });
    user.id = id;
    student.id = id;

    // Create student
    const newStudent = await Student.create(student);
    if (!newStudent) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create student");
    }

    // Attach student to user
    user.student = newStudent._id;

    // Create user
    const newUser = await User.create(user);
    if (!newUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, "User not created");
    }

    newUserData = newUser;
  } catch (error) {
    console.error("Error during creation:", error); // Log the error
    throw error;
  }

  if (newUserData) {
    newUserData = await User.findOne({ id: newUserData.id }).populate({
      path: "student",
      populate: [
        {
          path: "academicSemester",
        },
        {
          path: "academicDepartment",
        },
        {
          path: "academicFaculty",
        },
      ],
    });
  }

  if(newUserData){
    await RedisClient.publish(EVENT_STUDENT_CREATED, JSON.stringify(newUserData.student))
  }
  return newUserData;
};

const createUser = async (
  user: IUser,
  academicSemester?: Partial<IAcademicSemester>
): Promise<IUser | null> => {
  let id: string;
  //generated pass
  if (user.role === "student") {
    if (!academicSemester || !academicSemester.year || !academicSemester.code) {
      throw new Error(
        "Academic semester details are required for student ID generation."
      );
    }
    id = await generateStudentId({
      year: academicSemester.year,
      code: academicSemester.code as IAcademicSemesterCode,
    });
  } else if (user.role === "admin") {
    id = await generateAdminId();
  } else if (user.role === "super_admin") {
    id = await generateSuperAdminId();
  } else if (user.role === "faculty") {
    id = await generateFacultyId();
  } else {
    throw new Error("Unknown user role");
  }
  user.id = id;

  //default pass
  if (!user.password) {
    user.password = config.default_st_pass as string;
  }

  const createdUser = await User.create(user);

  if (!createdUser) {
    throw new Error("Failed to create user");
  }
  return createdUser;
};

const getAllUsers = async (
  filters: IUserFilters,
  paginationOptions: IPagniationOptions
): Promise<IGenericResponse<IUser[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  const andCondition = [];

  // Initial search using string fields with regex
  if (searchTerm) {
    andCondition.push({
      $or: usersSearchableFiels.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andCondition.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  let result = await User.find({
    $and: andCondition.length > 0 ? andCondition : [{}],
  })
    .populate("student")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  // const total = await AcademicSemester.countDocuments()
  let total = await User.countDocuments({
    $and: andCondition.length > 0 ? andCondition : [{}],
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const singleUser = async (id: string) => {
  const result = await User.findById(id).populate("student");

  return result;
};

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndDelete({ _id: id }, { new: true });
  return result;
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  const result = await User.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const createFaculty = async(
  faculty:IFaculty,
  user:IUser
):Promise<IUser | null>=>{
  if (!user.password) {
    user.password = config.default_st_pass as string;
  }

  user.role = 'faculty';

  let newUserData = null;

  try {
    const id = await generateFacultyId();

    user.id = id;
    faculty.id = id;

    const newFaculty = await Faculty.create(faculty);

    if(!newFaculty){
      throw new ApiError(httpStatus.BAD_REQUEST,'Failed to create faculty')
    }

    user.faculty = newFaculty._id

    const newUser = await User.create(user)
    if(!newUser){
      throw new ApiError(httpStatus.BAD_REQUEST,'Failed to create faculty')
    }

    newUserData = newUser

  } catch (error) {
    throw error;
  }

  if(newUserData){
    newUserData = await User.findOne({id:newUserData.id}).populate({
      path:'faculty',
      populate:[
        {
          path:'academicDepartment', 
        },{
          path:'academicFaculty',
        }
      ]
    })
  }

  if(newUserData){
    await RedisClient.publish(EVENT_FACULTY_CREATED,JSON.stringify(newUserData))
  }
  return newUserData;

}

const createAdmin = async(
  admin:IAdmin,
  user:IUser
):Promise<IUser | null>=>{
    if(!user.password){
      user.password = config.default_st_pass as string;
    } 

    user.role = 'admin';

    let createdAdminData = null; 

    try {
      const id = await generateAdminId();
      user.id = id;
      admin.id = id;

      const newAdmin = await Admin.create(admin);
     
      if(!newAdmin){
        throw new ApiError(httpStatus.BAD_REQUEST,'Failed to create admin') 
      }

      user.admin = newAdmin._id

      const newUser = await User.create(user);

      if(!newUser){
        throw new ApiError(httpStatus.BAD_REQUEST,'Failed to create user')
      }

      createdAdminData = newUser;


    } catch (error) {

      throw error 
    }

    if(createdAdminData){
      createdAdminData = await User.findOne({id:createdAdminData.id}).populate({
        path:'admin',
        populate:[
          {
            path:'managementDepartment',
          }
        ]
      })
    }

    if(createdAdminData){
      await RedisClient.publish(EVENT_ADMIN_CREATED,JSON.stringify(createdAdminData))
    }

    return createdAdminData
}

// const createSuperAdmin = async(
//   superAdmin:ISuperAdmin,
//   user:IUser
// ):Promise<IUser | null>=>{

//   const isExist = await SuperAdmin.findOne({
//     $or:[
//       {email:superAdmin.email},
//       {contactNo:superAdmin.contactNo}
//     ]
//   });

//   if(isExist){
//     throw new ApiError(httpStatus.FOUND,'User already found with same email or contact no.')
//   }


//   if(!user.password){
//     user.password = config.default_sup_adm_pass as string;
//   }
//   user.role = 'super_admin';
//   let createSuperAdmin = null;

//   try {
//     const id = await generateSuperAdminId();
//     user.id = id;
//     superAdmin.id = id;
//     const newSuperAdmin = await SuperAdmin.create(superAdmin);
//     if(!newSuperAdmin){
//       throw new ApiError(httpStatus.BAD_REQUEST,'Failed to create super admin')
//     }
//     user.superAdmin = newSuperAdmin._id;

//     const newUser = await User.create(user);
//     if(!newUser){
//       throw new ApiError(httpStatus.BAD_REQUEST,'Failed to create user')
//     }
//     createSuperAdmin = newUser;
//   } catch (error) {
//     throw error
//   }

//   if(createSuperAdmin){
//     createSuperAdmin = await User.findOne({id:createSuperAdmin.id}).populate({
//       path:'superAdmin',
//       populate:[{path:'managementDepartment'}]
//     })
//   }
  
//   if(createSuperAdmin){
//    await RedisClient.publish(EVENT_SUPER_ADMIN_CREATED,JSON.stringify(createSuperAdmin));


//    // Wait for the response event 
//    const success = await new Promise<boolean>((resolve)=>{
//     RedisClient.subscribe(EVENT_SUPER_ADMIN_CREATE_RESPONSE,async(e:string)=>{
//       const data = JSON.parse(e);
//       resolve(data.success)
//     })
//    });

//    if(!success){
//     throw new ApiError(httpStatus.BAD_REQUEST,"Super Admin not created")
//    }
//   }

  
//   return createSuperAdmin;

// }


const createSuperAdmin = async(superAdmin:ISuperAdmin,user:IUser):Promise<IUser | null>=>{
  try {
    const isExist = await SuperAdmin.findOne({
      $or:[{email:superAdmin.email},{contactNo:superAdmin.contactNo}]
    });
    if(isExist){
      throw new ApiError(httpStatus.FOUND, "User already exists with same email or contact no. ")
    }

    if(!user.password){
      user.password = config.default_sup_adm_pass as string;
    }

    user.role = 'super_admin';

    // Generate Super Admin ID
    const id = await generateSuperAdminId();
    user.id = id;
    superAdmin.id = id;

    // Create SuperAdmin document 
    const newSuperAdmin = await SuperAdmin.create(superAdmin);

    if(!newSuperAdmin){
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create super admin");
    }

    user.superAdmin = newSuperAdmin._id;

    // create user document 
    const newUser = await User.create(user);
    if(!newUser){
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create user");
    }

    // Populate Super Admin details
    const populatedUser = await User.findOne({ id: newUser.id }).populate({
      path: "superAdmin",
      populate: [{ path: "managementDepartment" }],
    })

    if(!populatedUser){
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to fetch user details");
    }

    // publish event to redis 
    await RedisClient.publish(EVENT_SUPER_ADMIN_CREATED, JSON.stringify(populatedUser));

    // Wait for the response event 
    const success = await new Promise<boolean>((resolve,reject)=>{
      const timeout = setTimeout(() => {
        RedisClient.unsubscribe(EVENT_SUPER_ADMIN_CREATE_RESPONSE);
        reject(new ApiError(httpStatus.REQUEST_TIMEOUT, "Redis response timeout"));
      }, 10000); // Set timeout (10s)


      RedisClient.subscribe(EVENT_SUPER_ADMIN_CREATE_RESPONSE,async(e:string)=>{
        clearTimeout(timeout);
        RedisClient.unsubscribe(EVENT_SUPER_ADMIN_CREATE_RESPONSE);
        const data = JSON.parse(e);
        resolve(data.success)
      })
    });

    if(!success){
      throw new ApiError(httpStatus.BAD_REQUEST,"Super Admin not created")
    }
    return populatedUser;
  } catch (error) {
    throw error;
  }
}

export const userService = {
  createStudent,
  getAllUsers,
  singleUser,
  deleteUser,
  updateUser, 
  createAdmin,
  createFaculty,
  createSuperAdmin,
};
