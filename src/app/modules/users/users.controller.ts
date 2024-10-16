import {  NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./users.service";
import catchAsnc from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";


const createUser= catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
  const {user} = req.body
        const result = await userService.createUser(user);
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'User created successfully',
            data:result
        })
        next();
})

// const createUser:RequestHandler= async(req,res,next)=>{
//   try {
//      const {user} = req.body
//      const result = await userService.createUser(user)
//      res.status(200).json({
//          sucess:true,
//          message:'User created successfully',
//          data:result
//      })
//   } catch (error) {
//     next(error)
//   }
// }

export const userController = {
    createUser
}