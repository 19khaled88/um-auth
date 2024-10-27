import { Model } from "mongoose";
import { IGenericErrorMessage } from "./error"
import { IUser, IUserMethods } from "../app/modules/users/users.interface";
import { IAcademicFaculty } from "../app/modules/academicFaculty/interface";
import { IAcademicDepartment } from "../app/modules/academicDepartment/interface";
import { IAuth } from "../app/modules/auth/interface";

export type IGenericErrorResponse ={
    statusCode:number,
    message:string,
    errorMessage:IGenericErrorMessage[]
}

export type UserModel = Model<IUser, Record<string, unknown>,IUserMethods>;
export type AcademicFacultyModel = Model<IAcademicFaculty,Record<string, unknown>>
export type AcademicDepartmentModel = Model<IAcademicDepartment,Record<string, unknown>>
export type AuthtModel = Model<IAuth,Record<string, unknown>>
