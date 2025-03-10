import {  NextFunction, Request, RequestHandler, Response } from "express";
import { AcademicSemesterService } from "./academicSemester.service";
import catchAsnc from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { searchAndFilterableFields } from "../../../constants/academicSemester";




const createAcademicSemester= catchAsnc(async(req:Request,res:Response)=>{
  const {...academicSemesterData} = req.body
    const result = await AcademicSemesterService.createSemester(academicSemesterData);
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Academic semester created successfully',
        data:result
    })
   
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


const getAllAcademicSemester = catchAsnc(
    async(req:Request,res:Response)=>{
        const filters = pick(req.query, searchAndFilterableFields)
        const paginationOptions = pick(req.query, paginationFields)
        const result = await AcademicSemesterService.getAllAcademicSemester(filters,paginationOptions)

        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'All academic semester found!',
            meta:result.meta,
            data:result.data
        })
    },
 
)

const getSingleAcademicSemester = catchAsnc(async(req:Request,res:Response)=>{
    const result = await AcademicSemesterService.getSingleAcademicSemester(req.params.id)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Single academic semester info found for given data',
        data:result
    })
})

const updateAcademicSemester = catchAsnc(async(req:Request,res:Response)=>{

    const result = await AcademicSemesterService.updateAcademicSemester(req.params.id, req.body);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Update for given id happend successflly',
        data:result
    })
})

const deleteAcademicSemester=catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    const result = await AcademicSemesterService.deleteAcademicSemester(req.params.id);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'academic semester deleted for given id',
        data:result
    })
})

export const academicSemesterController = {
    createAcademicSemester,
    getAllAcademicSemester,
    getSingleAcademicSemester,
    updateAcademicSemester,
    deleteAcademicSemester
}