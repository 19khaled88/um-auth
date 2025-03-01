import { Model, Types } from "mongoose";
import { IManagementDepartment } from "../managementDepartment/interface";
export type UserName = {
    firstName: string;
    lastName: string;
    middleName: string;
  };

 export type ISuperAdmin = {
    id: string;
    name: UserName;
    profileImage: string;
    dateOfBirth?: string;
    email: string;
    contactNo: string;
    emergencyContactNo: string;
    gender?: 'male' | 'female';
    permanentAddress?: string;
    presentAddress?: string;
    bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
    
    isSuperAdmin?:boolean;
    permissions?:string[];
    managementDepartment: Types.ObjectId | IManagementDepartment;
    designation: string;
  };
  
  export type SuperAdminModel = Model<ISuperAdmin, Record<string, unknown>>;