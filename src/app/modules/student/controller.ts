import { NextFunction, Request, Response } from "express"
import catchAsnc from "../../../shared/catchAsync"
import pick from "../../../shared/pick"
import { searchAndFilterableFields } from "./constans"
import { paginationFields } from "../../../constants/pagination"
import { studentServices } from "./service"
import sendResponse from "../../../shared/sendResponse"
import httpStatus from "http-status"


const getAllStudents = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    try {
     const filters = pick(req.query, searchAndFilterableFields)
     const paginationOptions = pick(req.query, paginationFields)
     const result = await studentServices.getAllStudents(filters,paginationOptions)
     sendResponse(res,{
         statusCode:httpStatus.OK,
         success:true,
         message:'All students found!',
         meta:result.meta,
         data:result.data
     })
    } catch (error) {
     sendResponse(res,{
         statusCode:httpStatus.INTERNAL_SERVER_ERROR,
         success:false,
         message:'No students found!',
         data:null
     })
    }
 })

 const singleStudent = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await studentServices.getSingleStudent(req.params.id)

        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Single student found!',
            data:result
        })
    } catch (error) {
        sendResponse(res,{
            statusCode:httpStatus.INTERNAL_SERVER_ERROR,
            success:false,
            message:'Student for give ID not found!',
            data:null
        })
    }
    
})

const deleteStudent = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const result = await studentServices.deleteStudent(req.params.id)

        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Student deleted successfully',
            data:result
        })
    } catch (error) {
        sendResponse(res,{
            statusCode:httpStatus.INTERNAL_SERVER_ERROR,
            success:false,
            message:'Student deletion unsuccessful!',
            data:null
        })
    }
   
})

const updateStudent = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
   try {
        const result = await studentServices.updateStudent(req.params.id,req.body)

        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Updated student info successfully',
            data:result
        })
   } catch (error) {
    console.log(error)
        sendResponse(res,{
            statusCode:httpStatus.INTERNAL_SERVER_ERROR,
            success:false,
            message:'Failed to update student info!',
            data:null
        }) 
   }
})


export const studentsController ={
    getAllStudents,
    singleStudent,
    deleteStudent,
    updateStudent
}