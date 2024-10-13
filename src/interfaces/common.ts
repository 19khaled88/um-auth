import { Model } from "mongoose";
import { IGenericErrorMessage } from "./error"
import { IUser } from "../app/modules/users/users.interface";

export type IGenericErrorResponse ={
    statusCode:number,
    message:string,
    errorMessage:IGenericErrorMessage[]
}

export type UserModel = Model<IUser, Record<string, unknown>>;