// only business logic intregrated in services

import { SortOrder } from "mongoose"
import config from "../../../config"
import { paginationHelper } from "../../../helper/paginationHelper"
import { IGenericResponse, IPagniationOptions } from "../../../shared/interfaces"
import { usersSearchableFiels } from "../../../constants/user"
import { IAcademicDepartment, IAcademicDepartmentFilters } from "./interface"
import { AcademicDepartment } from "./model"
import { academicDepartmentSearchableFiels } from "../../../constants/academicDepartment"

const createAcademicDepartment = async(academicDepartment:IAcademicDepartment):Promise<IAcademicDepartment | null>=>{
    const result = (await AcademicDepartment.create(academicDepartment)).populate('academicFaculty') 

    return result
   
}

const getAllAcademicDepartments = async(filters:IAcademicDepartmentFilters,paginationOptions:IPagniationOptions):Promise<IGenericResponse<IAcademicDepartment[]>>=>{
    const {searchTerm,...filtersData} = filters
    const {page,limit,skip,sortBy, sortOrder} = paginationHelper.calculatePagination(paginationOptions)

    const sortConditions:{[key:string] : SortOrder} ={}

    
    const andCondition = []

    // Initial search using string fields with regex
    if(searchTerm){
        andCondition.push({
            $or:academicDepartmentSearchableFiels.map((field)=>({
                [field]:{
                    $regex:searchTerm,
                    $options:'i'
                }
            }))
        })
    }

    if(Object.keys(filtersData).length){
        andCondition.push({
            $and:Object.entries(filtersData).map(([field, value])=>({
                [field]:value
            }))
        })
    }

    if(sortBy && sortOrder){
        sortConditions[sortBy] = sortOrder;
    }

    let result = await AcademicDepartment
    .find({$and:andCondition.length > 0 ? andCondition: [{}] })
    .populate('academicFaculty')
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

    // const total = await AcademicSemester.countDocuments()
    let total = await AcademicDepartment.countDocuments({ $and: andCondition.length > 0 ? andCondition : [{}] });

    return {
        meta:{
            page,
            limit,
            total,
        },
        data:result
    }

}

const singleAcademicDepartment = async(id:string)=>{
    const result = await AcademicDepartment.findById(id).populate('academicFaculty')

    return result
}

const deleteAcademicDepartment = async(id:string)=>{
    const result = await AcademicDepartment.findByIdAndDelete({_id:id},{new:true})
    return result
}

const updateAcademicDepartment = async(id:string,payload:Partial<IAcademicDepartment>)=>{
    const result = await AcademicDepartment.findByIdAndUpdate({_id:id},payload,{new:true}).populate('academicFaculty')
    return result
}


export const academicDepartmentService = {
    createAcademicDepartment,
    getAllAcademicDepartments,
    singleAcademicDepartment,
    deleteAcademicDepartment,
    updateAcademicDepartment
}