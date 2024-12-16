import { Types } from "mongoose";
import { IAcademicFaculty } from "../academicFaculty/interface";

export type IAcademicDepartment = {
    title:string;
    academicFaculty:Types.ObjectId | IAcademicFaculty;
    syncId:string;
}

export type IAcademicDepartmentFromEvents = {
    title:string;
    academicFacultyId:string;
    id:string;
}


export type IAcademicDepartmentFilters ={
    searchTerm? : string;
    academicFaculty?:Types.ObjectId
}
