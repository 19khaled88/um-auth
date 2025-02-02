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
import { EVENT_ADMIN_CREATED, EVENT_FACULTY_CREATED, EVENT_STUDENT_CREATED } from "./users.constats";

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

      user.admin = newAdmin._id;

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




export const userService = {
  createStudent,
  getAllUsers,
  singleUser,
  deleteUser,
  updateUser, 
  createAdmin,
  createFaculty
};
