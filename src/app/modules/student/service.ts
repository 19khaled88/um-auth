import { SortOrder } from "mongoose";
import { paginationHelper } from "../../../helper/paginationHelper";
import {
  IGenericResponse,
  IPagniationOptions,
} from "../../../shared/interfaces";
import { IStudent, IStudentFilters } from "./interface";
import { studentsSearchableFiels } from "../../../constants/students";
import { Student } from "./model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "../users/users.model";
import { RedisClient } from "../../../shared/redis";
import { EVENT_STUDENT_DELETED, EVENT_STUDENT_UPDATED } from "./constans";
import { FileUploadCloudinary } from "../../../helper/cloudinary";


const getAllStudents = async (
  filters: IStudentFilters,
  paginationOptions: IPagniationOptions
): Promise<IGenericResponse<IStudent[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  const andCondition = [];

  // Initial search using string fields with regex
  if (searchTerm) {
    andCondition.push({
      $or: studentsSearchableFiels.map((field) => ({
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

  let result = await Student.find({
    $and: andCondition.length > 0 ? andCondition : [{}],
  })
    .populate([
      { path: "academicFaculty" },
      { path: "academicDepartment" },
      { path: "academicSemester" },
    ])
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  // const total = await AcademicSemester.countDocuments()
  let total = await Student.countDocuments({
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

const getSingleStudent = async (id: string) => {
  const result = await Student.findById(id).populate([
    { path: "academicFaculty" },
    { path: "academicDepartment" },
    { path: "academicSemester" },
  ]);

  return result;
};

const updateStudent = async (id: string, payload: Partial<IStudent>):Promise<IStudent> => {
  const isExist = await Student.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student data not found");
  }

  let updateObject: any = {};
  
  for (const key in payload) {
    const value = payload[key as keyof IStudent];
    if (typeof value === "object" && value !== null) {
      for(const nestedKey in value){
        const newValue = value[nestedKey as keyof typeof value]
        for(let newVal in newValue as any){

          updateObject = {
            ...updateObject,
            [`${nestedKey}.${newVal}`] : newValue[newVal]

          }
        }
      }
      
    } else {
      updateObject = {
        ...updateObject,
        [key]:value
      }
     
    }
  }

  
  const result = await Student.findByIdAndUpdate(
    { _id: id },
    { $set: updateObject },
    { new: true,runValidators:true }
  ).populate([
    { path: "academicFaculty" },
    { path: "academicDepartment" },
    { path: "academicSemester" },
  ]);


  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to update student data");
  }else{
    await RedisClient.publish(EVENT_STUDENT_UPDATED,JSON.stringify(result))
  }


  
  return result;
};

const checkIfStudentDuplicate = async(data:any)=>{
  try {
    const result = await Student.findOne({
        $or:[
          {email: data.email}, 
          {contactNo: data.contactNo}, 
        ],
    });
    return result;
  } catch (error) {
      throw error;
  }
  
}

const deleteStudent = async (id: string) => {
  const isExist = await Student.findOne({ _id: id });
  
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "This student not found");
  }

  try {
    // Backup the faculty document before deletion
    const backupStudent = isExist.toObject();

    // delete from student table
    const deletedStudent = await Student.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    
    if (!deletedStudent) {
      throw new ApiError(httpStatus.NOT_FOUND, "This student not found");
    }

    // delete from user table
    const isDeletedUser = await User.deleteOne({ id: deletedStudent.id }, { new: true });
   
    if (isDeletedUser.deletedCount === 0) {
      await Student.create(backupStudent);
      throw new ApiError(httpStatus.NOT_FOUND, "Failed to delete associated user, Student delete rolled back");
    }else{
      if(deletedStudent.profileImage){
        await FileUploadCloudinary.deleteFromCloudinary(deletedStudent.profileImage,'single')
      }
      await RedisClient.publish(EVENT_STUDENT_DELETED,JSON.stringify(deletedStudent))
    }


    return deletedStudent;
  } catch (error) {
    throw error;
  }
};

export const studentServices = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
  checkIfStudentDuplicate
};
