import {  NextFunction, Request, RequestHandler, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

import { paginationFields } from "../../../constants/pagination";
import { academicFacultyService } from "./services";
import { searchAndFilterableFields } from "../../../constants/academicFaculty";




const createAcademicFaculty= catchAsnc(async(req:Request,res:Response)=>{
  const {...academicFaculty} = req.body
        const result = await academicFacultyService.createAcademicFaculty(academicFaculty);
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Academic Faculty created successfully',
            data:result
        })
       
})



const getAcademicFaculties = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
   
    const filters = pick(req.query, searchAndFilterableFields)
    const paginationOptions = pick(req.query, paginationFields)
    const result = await academicFacultyService.getAllAcademicFaculties(filters,paginationOptions)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'All academic faculties found!',
        meta:result.meta,
        data:result.data
    })
})

const singleAcademicFaculty = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    const result = await academicFacultyService.singleAcademicFaculty(req.params.id)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Single academic faculty found!',
        data:result
    })
})

const deleteAcademicFaculty = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    const result = await academicFacultyService.deleteAcademicFaculty(req.params.id)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'deleted academic faculty',
        data:result
    })
})

const updateAcademicFaculty= catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    const result = await academicFacultyService.updateAcademicFaculty(req.params.id,req.body)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'updated academic faculty info',
        data:result
    })
})

export const academicFacultyController = {
    createAcademicFaculty,
    getAcademicFaculties,
    singleAcademicFaculty,
    deleteAcademicFaculty,
    updateAcademicFaculty
}