import { Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./constants";
import { paginationFields } from "../../../constants/pagination";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import { adminService } from "./service";
import { IAdmin } from "./interface";


const getAllAdmins = catchAsnc(async(req:Request,res:Response)=>{
    const filters = pick(req.query, adminFilterableFields);
    const paginations = pick(req.query, paginationFields);

    const result = await adminService.getAllAdmins(filters,paginations)
    sendResponse<IAdmin[]>(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Admins found successfully',
        meta:result.meta,
        data:result.data
    })
})

const getSingleAdmin = catchAsnc(async(req:Request,res:Response)=>{
    const id = req.params.id 
    const result = await adminService.getSingleAdmin(id);

    sendResponse<IAdmin>(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Admin found successfully',
        data:result
    })
})

const updateAdmin = catchAsnc(async(req:Request,res:Response)=>{
    const id = req.params.id;
    const updateData = req.body;

    const result = await adminService.updateAdmin(id,updateData);

    sendResponse<IAdmin>(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Admin updated successfully',
        data:result
    })
})

const deleteAdmin = catchAsnc(async(req:Request,res:Response)=>{
    const id = req.params.id;
    const result = await adminService.deleteAdmin(id)

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Admin deleted successfully',
        data:result
    })
})

export const adminController = {
    getAllAdmins,
    getSingleAdmin,
    updateAdmin,
    deleteAdmin
}

