import { SortOrder } from "mongoose";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IGenericResponse, IPagniationOptions } from "../../../shared/interfaces";
import { managementDepartmentSearchableFields } from "./constants";
import { IManagementDepartment, IManagementDepartmentFilters } from "./interface";
import { ManagementDepartment } from "./model";

const createDepartment = async (
  payload: IManagementDepartment
): Promise<IManagementDepartment | null> => {
  const result = await ManagementDepartment.create(payload);
  return result;
};

const getSingleDepartment = async(id:string):Promise<IManagementDepartment | null>=>{
    const result = await ManagementDepartment.findById(id);
    return result
}

const getAllDepartment = async(
    filters:IManagementDepartmentFilters,
    paginations:IPagniationOptions
):Promise<IGenericResponse<IManagementDepartment[]>>=>{
    const {searchTerm, ...filterData} = filters;
    const {page,limit,skip,sortBy,sortOrder} = paginationHelper.calculatePagination(paginations);

    const andConditions = [];
    if(searchTerm){
       andConditions.push({
        $or:managementDepartmentSearchableFields.map(field=>({
            [field]:{
            $regex:searchTerm,
            $optoins:'i'
            },
        })),
       });
    }

    if(Object.keys(filterData).length){
        andConditions.push({
            $and:Object.entries(filterData).map(([field,value])=>({
                [field]:value
            }))
        })
    }

    const sortCondition:{[key:string]:SortOrder} = {}

    if(sortBy &&sortOrder){
        sortCondition[sortBy] = sortOrder;
    }

    const whereConditions = andConditions.length > 0 ? {$and:andConditions} : {};

    const result = await ManagementDepartment.find(whereConditions)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit); 

    const total = await ManagementDepartment.countDocuments();

    return {
        meta:{
            page,
            limit,
            total
        },
        data:result
    }

}

const updateDepartment = async(id:string,payload:Partial<IManagementDepartment>):Promise<IManagementDepartment | null>=> {
    const result = await ManagementDepartment.findOneAndUpdate(
        {_id:id},
        payload,
        {
            new:true
        }
    )
    return result
}

const deleteDepartment = async(id:string):Promise<IManagementDepartment | null>=>{
    const result = await ManagementDepartment.findByIdAndDelete(id);
    return result
}


export const managementDepartmentService = {
    createDepartment,
    getAllDepartment,
    getSingleDepartment,
    updateDepartment,
    deleteDepartment
}
