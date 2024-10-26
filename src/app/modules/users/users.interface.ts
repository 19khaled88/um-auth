// interfce > schema > model 

import { Types } from "mongoose";
import { IStudent } from "../student/interface";



export type IUser = {
    id:string;
    role:string;
    password:string;
    student?:Types.ObjectId | IStudent;
    // faculty?:Types.ObjectId | IFaculty;
    // admin?:Types.ObjectId | IAdmin;
}


export type IUserFilters ={
    searchTerm? : string 
}