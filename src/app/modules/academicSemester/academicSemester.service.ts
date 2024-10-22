// only business logic intregrated in services

import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { academicSemesterTitleCodeMapper } from "./academicSemester.constant";
import { IAcademicSemester, IAcademicSemeterFilters } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";
import { IGenericResponse, IPagniationOptions } from "../../../shared/interfaces";
import { paginationHelper } from "../../../helper/paginationHelper";
import { SortOrder } from "mongoose";
import { academicSemesternumericSearchableFields, academicSemesterSearchableFiels } from "../../../constants/academicSemester";


const createSemester=async(payload:IAcademicSemester):Promise<IAcademicSemester | null>=>{
    if(academicSemesterTitleCodeMapper[payload.title] !== payload.code){
        throw new ApiError(400,'Invalid Semester Code')
    }else{
        const result = await AcademicSemester.create(payload)
        return result
    }
    
}

const getAllAcademicSemester = async(
    filters:IAcademicSemeterFilters,
    payload:IPagniationOptions
):Promise<IGenericResponse<IAcademicSemester[]>>=>{
    const {searchTerm,...filtersData} = filters
    const {page,limit,skip,sortBy, sortOrder} = paginationHelper.calculatePagination(payload)
    const sortConditions:{[key:string] : SortOrder} ={}

    
    const andCondition = []
    
    // Initial search using string fields with regex
    if(searchTerm){
        andCondition.push({
            $or:academicSemesterSearchableFiels.map((field)=>({
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

    let result = await AcademicSemester
        .find({$and:andCondition.length > 0 ? andCondition: [{}] })
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)

    // const total = await AcademicSemester.countDocuments()
    let total = await AcademicSemester.countDocuments({ $and: andCondition.length > 0 ? andCondition : [{}] });


    // If no matches found, attempt to search numeric fields
    if (result.length === 0 && searchTerm) {
        const searchTermAsNumber = Number(searchTerm);
        if (!isNaN(searchTermAsNumber)) {
            // Clear previous conditions and add numeric search condition
            andCondition.length = 0;
            andCondition.push({
                $or: academicSemesternumericSearchableFields.map((field) => ({
                    [field]: searchTermAsNumber
                }))
            });
    
            // Perform the numeric search
            result = await AcademicSemester.find({ $and: andCondition })
                .sort(sortConditions)
                .skip(skip)
                .limit(limit);
    
            total = await AcademicSemester.countDocuments({ $and: andCondition.length > 0 ? andCondition: [{}] });
        }
    }

    return {
        meta:{
            page,
            limit,
            total,
        },
        data:result
    }
}

const getSingleAcademicSemester = async(id:string):Promise<IAcademicSemester | null>=>{
    const result = await AcademicSemester.findById(id)
    return result
}

const updateAcademicSemester=async(id:string,data:Partial<IAcademicSemester>)=>{
    if(data.title && data.code && academicSemesterTitleCodeMapper[data.title] !== data.code){
        throw new ApiError(400,'Semester must match with relevent code requirement')
    }else {
        const result = await AcademicSemester.findOneAndUpdate({_id:id},data,{new:true})
        return result
    }
    
}

const deleteAcademicSemester = async(id:string)=>{
    const result = await AcademicSemester.findByIdAndDelete({_id:id},{new:true})
    return result
}

export const AcademicSemesterService = {
    createSemester,
    getAllAcademicSemester,
    getSingleAcademicSemester,
    updateAcademicSemester,
    deleteAcademicSemester
}