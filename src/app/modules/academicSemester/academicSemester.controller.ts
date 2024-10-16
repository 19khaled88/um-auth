import {  NextFunction, Request, RequestHandler, Response } from "express";
import { AcademicSemesterService } from "./academicSemester.service";
import catchAsnc from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";



const createAcademicSemester= catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
  const {...academicSemesterData} = req.body
    const result = await AcademicSemesterService.createSemester(academicSemesterData);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Academic semester created successfully',
        data:result
    })
    next();
})


// const createAcademicSemester:RequestHandler= async(req,res,next)=>{
//   try {
//      const {...academicSemesterData} = req.body
//      const result = await AcademicSemesterService.createSemester(academicSemesterData)
//      res.status(200).json({
//          sucess:true,
//          message:'Academic semester created successfully',
//          data:result
//      })
//   } catch (error) {
//     next(error)
//   }
// }

export const academicSemesterController = {
    createAcademicSemester
}