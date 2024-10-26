import { Model, Types } from "mongoose";
import { string } from "zod";
import { IAcademicFaculty } from "../academicFaculty/interface";
import { IAcademicDepartment } from "../academicDepartment/interface";
import { IAcademicSemester } from "../academicSemester/academicSemester.interface";


export type UserName = {
    firstName:string;
    lastName:string;
    middleName:string
}

export type Guardian = {
    fatherName:string;
    fatherOccupation:string;
    fatherContactNo:string;
    motherName:string;
    motherContactNo:string
    motherOccupation:string
    address:string
}

export type LocalGuardian = {
    name:string;
    occupation:string;
    contactNo:string;
    address:string;
}


// schema interface
export type IStudent ={
    id:string;
    name:UserName;
    dateOfBirth:string;
    gender:'male' | 'female'
    bloodGroup?:'A+'|'A-'|"B+"|"B-"|"AB"|'AB-'|'O+'|'O-',
    email:string;
    contactNo:string;
    emergencyContactNo:string;
    presentAddress:string;
    permanentAddress:string;
    guardian:Guardian;
    localGuardian:LocalGuardian;
    profileImage?:string;
    academicFaculty:Types.ObjectId | IAcademicFaculty;
    academicDepartment:Types.ObjectId | IAcademicDepartment;
    academicSemester:Types.ObjectId | IAcademicSemester;
   
   
}

// student model
export type StudentModel = Model<IStudent, Record<string, unknown>>

export type IStudentFilters ={
    searchTerm? : string 
}