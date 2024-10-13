import {Model, Schema,model} from 'mongoose'; 
import { UserModel } from '../../../interfaces/common';
import { AcademicSemesterModel, IAcademicSemester } from './academicSemester.interface';
import { code, month, title } from './academicSemester.constant';

// const month =["January", "February", "March" , "April", "May", "June", "July", "August" , "September" , "October", "November", "December"]
const academicSemesterSchema = new Schema<IAcademicSemester>(
    {
    title:{
        type:String,
        required:true,
        enum:title
    },
    year:{
        type:Number,
        required:true,
    },
    code:{
        type:String,
        required:true,
        enum:code
    },
    startMonth:{
        type:String,
        required:true,
        enum:month
    },
    endMonth:{
        type:String,
        required:true,
        enum:month
    }
},
{
    timestamps:true,
})

export const AcademicSemester = model<IAcademicSemester,AcademicSemesterModel>('AcademicSemester',academicSemesterSchema);
