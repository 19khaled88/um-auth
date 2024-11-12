import httpStatus from "http-status";
import catchAsnc from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { managementDepartmentService } from "./service";
import { IManagementDepartment } from "./interface";
import { Request, Response } from "express";
import pick from "../../../shared/pick";
import { managementDepartmentFilterableFields } from "./constants";
import { paginationFields } from "../../../constants/pagination";

const createDepartment = catchAsnc(async(req:Request,res:Response)=>{
    const {...departmentData} = req.body;
    const result = await managementDepartmentService.createDepartment(
        departmentData
    );

    sendResponse<IManagementDepartment>(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Management department created ',
        data:result
    })
});

const getAllDepartments = catchAsnc(async(req:Request, res:Response)=>{
    const filters = pick(req.query, managementDepartmentFilterableFields);
    const paginations = pick(req.query, paginationFields);

    const result = await managementDepartmentService.getAllDepartment(
        filters,
        paginations
    )

    sendResponse<IManagementDepartment[]>(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Management departments retrieved successfully',
        meta:result.meta,
        data:result.data
    })
});

const getSingleDepartment = catchAsnc(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const result = await managementDepartmentService.getSingleDepartment(id);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Management department found for give id',
        data:result
    })
})

const udpateDepartment = catchAsnc(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const updateData = req.body;
    const result = await managementDepartmentService.updateDepartment(id,updateData)

    sendResponse<IManagementDepartment>(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Management department updated successfully',
        data:result
    })
})

const deleteDepartment = catchAsnc(async(req:Request,res:Response)=>{
    const {id} = req.params;
    const result = await managementDepartmentService.deleteDepartment(id);

    sendResponse(res,{
        statusCode:httpStatus.OK,
        success:true,
        message:'Management department deleted successfully',
        data:result
    })
})

export const managementController = {
    createDepartment,
    getAllDepartments,
    getSingleDepartment,
    udpateDepartment,
    deleteDepartment
}