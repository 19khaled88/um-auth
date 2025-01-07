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
        success:true,
        message:'Login successful',
        data:result
    })
    } catch (error) {
        // sendResponse(res,{
        //     statusCode:httpStatus.INTERNAL_SERVER_ERROR,
        //     success:false,
        //     message:'Login failed',
        //     data:null
        // })
        next(error)
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
});


// First time user login password change 
const changePassword = catchAsnc(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const { ...userInfo } = await isJwtPayloadWithRole(req.user);
        const {...passwords} = req.body;
        const ifPasswrdChange = await authSerivce.changePassword(passwords,userInfo)

        // const result = await authSerivce.login({...passwords,userInfo})
        sendResponse(res,{
            statusCode:httpStatus.OK,
            success:true,
            message:'Password changed successfully',
            data:ifPasswrdChange
        })
    } catch (error) {
        sendResponse(res,{
            statusCode:httpStatus.NOT_FOUND,
            success:true,
            message:'Password not changed!',
            data:null
        })
    }
})

// function isJwtPayloadWidthRole(user:any):user is {userId:string;role:string}{
//     return user && typeof user.userId === 'string' && typeof user.role === 'string'
// }


async function isJwtPayloadWithRole(user: any): Promise<{ userId: string; role: string }> {
    return new Promise((resolve, reject) => {
        if (user && typeof user.id === 'string' && typeof user.role === 'string') {
            resolve({ userId: user.id, role: user.role });
        } else {
            reject(new Error('Invalid user payload'));
        }
    });
}

export const authController ={
    login,
    refreshToken,
    changePassword
}