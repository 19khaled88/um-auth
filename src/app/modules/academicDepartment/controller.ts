import {  NextFunction, Request, RequestHandler, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";

import { paginationFields } from "../../../constants/pagination";
import { academicDepartmentService } from "./services";
import { searchAndFilterableFields } from "../../../constants/academicDepartment";



const createAcademicDepartment= catchAsnc(async(req:Request,res:Response)=>{
  const {...academicDepartment} = req.body
        const result = await academicDepartmentService.createAcademicDepartment(academicDepartment);
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Academic Department created successfully',
            data:result
        })
       
})



const getAcademicDepartments = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    const filters = pick(req.query, searchAndFilterableFields)
    const paginationOptions = pick(req.query, paginationFields)
    const result = await academicDepartmentService.getAllAcademicDepartments(filters,paginationOptions)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'All academic departments found!',
        meta:result.meta,
        data:result.data
    })
})

const singleAcademicDepartment = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    const result = await academicDepartmentService.singleAcademicDepartment(req.params.id)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Single academic department found!',
        data:result
    })
})

const deleteAcademicDepartment = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    const result = await academicDepartmentService.deleteAcademicDepartment(req.params.id)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'deleted academic department',
        data:result
    })
})

const updateAcademicDepartment= catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    const result = await academicDepartmentService.updateAcademicDepartment(req.params.id,req.body)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'updated academic department info',
        data:result
    })
})

export const academicDepartmentController = {
    createAcademicDepartment,
    getAcademicDepartments,
    singleAcademicDepartment,
    deleteAcademicDepartment,
    updateAcademicDepartment
}