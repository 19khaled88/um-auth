import { Model } from "mongoose";

export type Month = "January"| "February"| "March"| "April" | "May"| "June"| "July"| "August"| "September"| "October"| "November"| "December";
export type IAcademicSemesterTitle ='Autumn' | 'Summer' | 'Fall'
export type IAcademicSemesterCode ='01' | '02' | '03'

export type IAcademicSemester ={
    title :IAcademicSemesterTitle;
    year:number;
    code:IAcademicSemesterCode;
    startMonth:Month;
    endMonth:Month;
    syncId:string
}

export type IAcademicSemesterFromEvent ={
    title :string;
    year:string;
    code:string;
    startMonth:string;
    endMonth:string;
    id:string
}

export type AcademicSemesterModel = Model<IAcademicSemester> 


export type IAcademicSemeterFilters ={
    searchTerm? : string 
}

