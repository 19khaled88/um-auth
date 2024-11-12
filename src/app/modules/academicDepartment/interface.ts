import { Types } from "mongoose";
import { IAcademicFaculty } from "../academicFaculty/interface";

export type IAcademicDepartment = {
    title:string;
    academicFaculty:Types.ObjectId | IAcademicFaculty;
}


export type IAcademicDepartmentFilters ={
    searchTerm? : string;
    academicFaculty?:Types.ObjectId
}
