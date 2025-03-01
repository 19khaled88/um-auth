import { NextFunction, Request, Response } from "express"
import catchAsnc from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import httpStatus from "http-status"
import { superAdminSerivce } from "./service"

const checkIfSuperAdminDuplicate = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
  
    try {
        const result = await superAdminSerivce.checkIfSuperAdminDuplicate(req.query)
       
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:result === null ? false : true,
            message:result === null ? 'No data found' : 'Info found',
            data:result
        })
        
    } catch (error) {
        next(error)
    }
  });

  export const SuperAdminController = {
   
    checkIfSuperAdminDuplicate
  };