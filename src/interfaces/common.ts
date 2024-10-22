import { Model } from "mongoose";
import { IGenericErrorMessage } from "./error"
import { IUser } from "../app/modules/users/users.interface";
import { IAcademicFaculty } from "../app/modules/academicFaculty/interface";
import { IAcademicDepartment } from "../app/modules/academicDepartment/interface";

export type IGenericErrorResponse ={
    statusCode:number,
    message:string,
    errorMessage:IGenericErrorMessage[]
}

export type UserModel = Model<IUser, Record<string, unknown>>;
export type AcademicFacultyModel = Model<IAcademicFaculty,Record<string, unknown>>
export type AcademicDepartmentModel = Model<IAcademicDepartment,Record<string, unknown>>