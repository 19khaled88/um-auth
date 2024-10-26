import {  NextFunction, Request, RequestHandler, Response } from "express";
import { userService } from "./users.service";
import catchAsnc from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../../shared/pick";
import { searchAndFilterableFields } from "./users.constats";
import { paginationFields } from "../../../constants/pagination";
import { User } from "./users.model";


const createStudent= catchAsnc(async(req:Request,res:Response)=>{
     try {
        const {student,...data} = req.body
        const result = await userService.createStudent(student,data);

        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'User created successfully',
            data:result
        })
        
    } catch (error) {
        console.error('Error in controller:', error);
        sendResponse(res,{
            statusCode:httpStatus.INTERNAL_SERVER_ERROR,
            success:false,
            message:'Failed to create user',
            data:null
        })
    }







    // try {
    //     const {user,academicSemester} = req.body
    //     const result = await userService.createUser(user,academicSemester);

    //     sendResponse(res,{
    //         statusCode:httpStatus.OK,
    //         success:true,
    //         message:'User created successfully',
    //         data:result
    //     })
    //     const {student,...data} = req.body 
    //     console.log(student,data)
    // } catch (error) {
    //     sendResponse(res,{
    //         statusCode:httpStatus.INTERNAL_SERVER_ERROR,
    //         success:false,
    //         message:'Failed to create user',
    //         data:null
    //     })
    // }
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

const getUsers = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
   try {
    const filters = pick(req.query, searchAndFilterableFields)
    const paginationOptions = pick(req.query, paginationFields)
    const result = await userService.getAllUsers(filters,paginationOptions)
    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'All users found!',
        meta:result.meta,
        data:result.data
    })
   } catch (error) {
    sendResponse(res,{
        statusCode:httpStatus.INTERNAL_SERVER_ERROR,
        success:false,
        message:'No user found!',
        data:null
    })
   }
})

const singleUser = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    const result = await userService.singleUser(req.params.id)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Single user found!',
        data:result
    })
})

const deleteUser = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    const result = await userService.deleteUser(req.params.id)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'delete user',
        data:result
    })
})

const updateUser= catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    const result = await userService.updateUser(req.params.id,req.body)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'update user info',
        data:result
    })
})

export const userController = {
    createStudent,
    getUsers,
    singleUser,
    deleteUser,
    updateUser
}