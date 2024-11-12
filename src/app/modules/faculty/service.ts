import { SortOrder } from "mongoose";
import { paginationHelper } from "../../../helper/paginationHelper";
import { IGenericResponse, IPagniationOptions } from "../../../shared/interfaces";
import { facultySearchableFields } from "./constants";
import { IFaculty, IFacultyFilters } from "./interface";
import { Faculty } from "./model";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "../users/users.model";


const getAllFaculties = async(
    filters:IFacultyFilters,
    paginations:IPagniationOptions
):Promise<IGenericResponse<IFaculty[]>>=>{
    const {searchTerm, ...filterData} = filters;
    const {page,limit,skip,sortBy,sortOrder} = paginationHelper.calculatePagination(paginations)

    const andCondition = [];

    if(searchTerm){
        andCondition.push({
            $or:facultySearchableFields.map(field =>({
                [field]:{
                    $regex:searchTerm,
                    $options:'i'
                }
            }))
        })
    }

    if(Object.keys(filterData).length){
        andCondition.push({
            $and:Object.entries(filterData).map(([field,value])=>({
                [field]:value
            }))
        })
    }

    const sortCondition:{[key:string]:SortOrder} = {};

    if(sortBy && sortOrder){
        sortCondition[sortBy] = sortOrder
    }

    const whereConditions = andCondition.length > 0? {$and:andCondition} :{};

    const result = await Faculty.find(whereConditions)
        .populate('academicDepartment')
        .populate('academicFaculty')
        .sort(sortCondition)
        .skip(skip)
        .limit(limit); 
    const total = await Faculty.countDocuments(whereConditions);

    return {
        meta: {
            page,
            limit,
            total
        },
        data:result 
    }
}

const getSingleFaculty = async(id:string):Promise<IFaculty | null>=>{
    const result = await Faculty.findOne({id})
        .populate('academicDepartment')
        .populate('academicFaculty')

    return result
}

const updateFaculty = async(id:string,payload:Partial<IFaculty>):Promise<IFaculty | null>=>{
    const isExist = await Faculty.findOne({id});

    if(!isExist){
        throw new ApiError(httpStatus.NOT_FOUND,'Faculty not found');
    }

    const {name, ...FacultyData} = payload;
    const updatedFacultyData:Partial<IFaculty> = {...FacultyData};

    if(name && Object.keys(name).length > 0){
        Object.keys(name).forEach(key=>{
            const nameKey = `name.${key}` as keyof Partial<IFaculty>;
            (updatedFacultyData as any)[nameKey] = name[key as keyof typeof name];
        })
    }

    const result = await Faculty.findOneAndUpdate({id}, updatedFacultyData,{
        new:true
    });

    return result
}

const deleteFaculty = async(id:string):Promise<IFaculty | null>=>{
    const isExist = await Faculty.findOne({id});

    if(!isExist){
        throw new ApiError(httpStatus.NOT_FOUND, 'Faculty not found')
    }

    try {
        const faculty = await Faculty.findOneAndDelete({id});
    if(!faculty){
        throw new ApiError(404,'Failed to delete faculty')
    }

    await User.deleteOne({id});

    return faculty;
    } catch (error) {
        throw error
    }
}

export const facultySerivce = {
    getAllFaculties,
    getSingleFaculty,
    updateFaculty,
    deleteFaculty
}