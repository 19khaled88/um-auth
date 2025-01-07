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

const deleteStudent = async (id: string) => {
  const isExist = await Student.findOne({ _id: id });
  
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "This student not found");
  }

  try {
    // Backup the faculty document before deletion
    const backupStudent = isExist.toObject();

    const deletedStudent = await Student.findOneAndDelete(
      { _id: id },
      { new: true }
    );
    
    if (!deletedStudent) {
      throw new ApiError(httpStatus.NOT_FOUND, "This student not found");
    }

    const isDeletedUser = await User.deleteOne({ id: deletedStudent.id }, { new: true });
   
    if (isDeletedUser.deletedCount === 0) {
      await Student.create(backupStudent);
      throw new ApiError(httpStatus.NOT_FOUND, "Failed to delete associated user, Student delete rolled back");
    }
    return deletedStudent;
  } catch (error) {
    throw error;
  }
};

const updateStudent = async (id: string, payload: Partial<IStudent>) => {
  const isExist = await Student.findOne({ _id: id });
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "Student data not found");
  }

  const updateObject: any = {};

  for (let key in payload) {
    const value = payload[key as keyof IStudent];

    if (typeof value === "object" && value !== null) {
      // For nested objects like name or guardian, iterate over the inner fields
      for (let nestedKey in value) {
        updateObject[`${key}.${nestedKey}`] =
          value[nestedKey as keyof typeof value];
      }
    } else {
      // For simple fields, just add them to the updateObject
      updateObject[key] = value;
    }
  }

  const result = await Student.findByIdAndUpdate(
    { _id: id },
    { $set: updateObject },
    { new: true }
  );

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Failed to update student data");
  }
  return result;
};

export const studentServices = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
