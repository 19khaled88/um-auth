import { NextFunction, Request, Response } from "express";
import catchAsnc from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { IFaculty } from "./interface";
import httpStatus from "http-status";
import { facultySerivce } from "./service";
import { facultyFilterableFields } from "./constants";
import { paginationFields } from "../../../constants/pagination";

const getAllFaculties = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = pick(req.query, facultyFilterableFields);
      const paginationOptions = pick(req.query, paginationFields);

      const result = await facultySerivce.getAllFaculties(
        filters,
        paginationOptions
      );

      sendResponse<IFaculty[]>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "faculties retrieved successfully !",
        meta: result.meta,
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }
);

const getSingleFaculty = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const result = await facultySerivce.getSingleFaculty(id);

      sendResponse<IFaculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "faculty retrieved successfully !",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

const updateFaculty = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const updatedData = req.body;
      const result = await facultySerivce.updateFaculty(id, updatedData);

      sendResponse<IFaculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "faculty updated successfully !",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

const deleteFaculty = catchAsnc(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const result = await facultySerivce.deleteFaculty(id);

      sendResponse<IFaculty>(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "faculty deleted successfully !",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const FacultyController = {
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
