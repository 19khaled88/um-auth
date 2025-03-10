import { SortOrder } from "mongoose";
import { paginationHelper } from "../../../helper/paginationHelper";
import {
  IGenericResponse,
  IPagniationOptions,
} from "../../../shared/interfaces";
import { EVENT_FACULTY_DELETED, EVENT_FACULTY_UPDATED, facultySearchableFields } from "./constants";
import { IFaculty, IFacultyFilters } from "./interface";
import { Faculty } from "./model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "../users/users.model";
import { RedisClient } from "../../../shared/redis";
import { FileUploadCloudinary } from "../../../helper/cloudinary";

const getAllFaculties = async (
  filters: IFacultyFilters,
  paginations: IPagniationOptions
): Promise<IGenericResponse<IFaculty[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginations);

  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: facultySearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andCondition.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const whereConditions = andCondition.length > 0 ? { $and: andCondition } : {};

  const result = await Faculty.find(whereConditions)
    .populate("academicDepartment")
    .populate("academicFaculty")
    .sort(sortCondition)
    .skip(skip)
    .limit(limit);
  const total = await Faculty.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleFaculty = async (id: string): Promise<IFaculty | null> => {
  const ifExist = await Faculty.findById(id);

  if (!ifExist) {
    throw new ApiError(httpStatus.CONFLICT, "Faculty not found");
  }
  const result = await Faculty.findOne({ _id: id })
    .populate("academicDepartment")
    .populate("academicFaculty");

  return result;
};

const updateFaculty = async (
  id: string,
  payload: Partial<IFaculty>
): Promise<IFaculty | null> => {
  const isExist = await Faculty.findOne({ _id: id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Faculty not found");
  }

  
  const { name, ...FacultyData } = payload;
  const updatedFacultyData: Partial<IFaculty> = { ...FacultyData };

  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach((key) => {
      const nameKey = `name.${key}` as keyof Partial<IFaculty>;
      (updatedFacultyData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Faculty.findOneAndUpdate(
    { _id: id },
    updatedFacultyData,
    {
      new: true,
    }
  ).populate('academicDepartment')
   .populate('academicFaculty');

  if(result){
    await RedisClient.publish(EVENT_FACULTY_UPDATED,JSON.stringify(result))
  }

  return result;
};

const checkIfFacultyDuplicaate=async(data:any)=>{
  try {
    const result = await Faculty.findOne({
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

const deleteFaculty = async (id: string): Promise<IFaculty | null> => {
  const isExist = await Faculty.findOne({ _id: id });

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Faculty not found");
  }
  
  try {
    // Backup the faculty document before deletion
    const backupFaculty = isExist.toObject();

    const deletedFaculty = await Faculty.findOneAndDelete({ _id: id });
    
    if (!deletedFaculty) {
      throw new ApiError(httpStatus.NOT_FOUND, "Failed to delete faculty");
    }

    const userDeleted = await User.deleteOne({ id:deletedFaculty.id });
    if (userDeleted.deletedCount === 0) {
      await Faculty.create(backupFaculty);
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Failed to delete associated user, Faculty delete rolled back"
      );
    }

    if(userDeleted.deletedCount === 1){
      const res =await FileUploadCloudinary.deleteFromCloudinary(isExist.profileImage, 'single')

      if(res.result != 'ok'){
        await Faculty.create(backupFaculty);
      }
    }

    if(userDeleted.deletedCount === 1){
      await RedisClient.publish(EVENT_FACULTY_DELETED,JSON.stringify(backupFaculty));
    }

    return deletedFaculty;
  } catch (error) {
    throw error;
  }
};

export const facultySerivce = {
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
  checkIfFacultyDuplicaate
};
