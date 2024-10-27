import { NextFunction, Response, Request } from "express"
import catchAsnc from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import httpStatus from "http-status"
import { authSerivce } from "./services"
import config from "../../../config"
import { LoginResponse } from "./interface"


const login = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {...loginData} = req.body
        const result = await authSerivce.login(loginData)
        const {refresh, ...others} = result

        const cookieOptions ={
            secure:config.env === 'production',
            httpOnly:true
        }
        res.cookie('refreshtoken',refresh,cookieOptions)

    
       sendResponse<LoginResponse>(res,{
        statusCode:httpStatus.OK,
        success:false,
        message:'Login successful',
        data:others
    })
    } catch (error) {
        sendResponse(res,{
            statusCode:httpStatus.INTERNAL_SERVER_ERROR,
            success:false,
            message:'Login failed',
            data:null
        })
    }
})

const refreshToken = catchAsnc(async (req:Request,res:Response,next:NextFunction)=>{
    try {
       
        const {...data} = req.cookies
        const result = await authSerivce.refreshToken(data.refreshtoken)
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:false,
            message:'refresh token created',
            data:result
        })
    } catch (error) {
        sendResponse(res,{
            statusCode:httpStatus.INTERNAL_SERVER_ERROR,
            success:false,
            message:'token not found',
            data:null
        })
    }
})

export const authController ={
    login,
    refreshToken
}