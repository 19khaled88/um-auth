// interfce > schema > model 

import { Types } from "mongoose";
import { IStudent } from "../student/interface";
import { IFaculty } from "../faculty/interface";
import { IAdmin } from "../admin/interface";



export type IUser = {
    id:string;
    role:string;
    password:string;
    needsPassChange:true | false;
    passwordChangedAt:Date;
    student?:Types.ObjectId | IStudent;
    faculty?:Types.ObjectId | IFaculty;
    admin?:Types.ObjectId | IAdmin;
}


// user methods for using with instance of user, not for user static method
export type IUserMethods= {
    isUserExist(id:string):Promise<Partial<IUser> | null>;
    isPasswordMatch(givenPass:string,savedPass:string):Promise<boolean>
}

export type IUserFilters ={
    searchTerm? : string 
}


// export type UserModel = {
//     isUserExist(
//       id: string
//     ): Promise<Pick<IUser, 'id' | 'password' | 'role' | 'needsPasswordChange'>>;
//     isPasswordMatched(
//       givenPassword: string,
//       savedPassword: string
//     ): Promise<boolean>;
//   } & Model<IUser>;