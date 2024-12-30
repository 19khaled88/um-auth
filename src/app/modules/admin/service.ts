import { SortOrder } from "mongoose";
import { paginationHelper } from "../../../helper/paginationHelper";
import {
  IGenericResponse,
  IPagniationOptions,
} from "../../../shared/interfaces";
import { adminSearchableFields } from "./constants";
import { IAdmin, IAdminFilters } from "./interface";
import { Admin } from "./model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "../users/users.model";

const getAllAdmins = async (
  filters: IAdminFilters,
  paginationOptions: IPagniationOptions
): Promise<IGenericResponse<IAdmin[]>> => {
  const { searchTerm, ...filterData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: adminSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filterData).length) {
    andConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Admin.find(whereConditions)
    .populate("managementDepartment")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Admin.countDocuments(whereConditions);

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getSingleAdmin = async (id: string): Promise<IAdmin | null> => {
  const ifExist = await Admin.findById(id);
  console.log(ifExist)
  if (!ifExist) {
    throw new ApiError(httpStatus.CONFLICT, "This admin not found");
  }
  const result = await Admin.findOne({ _id:id }).populate("managementDepartment");
  return result;
};

const updateAdmin = async (id: string, payload: Partial<IAdmin>) => {
  const isExist = await Admin.findById(id);

  
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "This Admin not found");
  }

  const { name, ...adminData } = payload;

  const updatedData: Partial<IAdmin> = { ...adminData };
  if (name && Object.keys(name).length > 0) {
    Object.keys(name).forEach((key) => {
      const nameKey = `name.${key}` as keyof Partial<IAdmin>;

      (updatedData as any)[nameKey] = name[key as keyof typeof name];
    });
  }

  const result = await Admin.findOneAndUpdate({ _id:id }, updatedData, {
    new: true,
  });
  return result;
};

const deleteAdmin = async (id: string): Promise<IAdmin | null> => {
  const isExist = await Admin.findById(id);

  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "This admin/faculty not found");
  }

  try {
    const admin = await Admin.findOneAndDelete({_id:id });
    if (!admin) {
      throw new ApiError(404, "Failed to delete student");
    }

    await User.deleteOne({ id });
    return admin;
  } catch (error) {
    throw error;
  }
};

export const adminService = {
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
