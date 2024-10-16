// only business logic intregrated in services

import httpStatus from "http-status";
import ApiError from "../../../errors/ApiError";
import { academicSemesterTitleCodeMapper } from "./academicSemester.constant";
import { IAcademicSemester } from "./academicSemester.interface";
import { AcademicSemester } from "./academicSemester.model";


const createSemester=async(payload:IAcademicSemester):Promise<IAcademicSemester | null>=>{
    if(academicSemesterTitleCodeMapper[payload.title] !== payload.code){
        throw new ApiError(400,'Invalid Semester Code')
    }else{
        const result = await AcademicSemester.create(payload)
        return result
    }
    
}

export const AcademicSemesterService = {
    createSemester
}