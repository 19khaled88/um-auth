
import { Schema,model} from 'mongoose'; 
import { IAcademicDepartment } from './interface';
import { AcademicDepartmentModel} from '../../../interfaces/common';


const academicDepartment = new Schema<IAcademicDepartment>(
    {
    title:{
        type:String,
        required:true,
        unique:true
    },
    academicFaculty:{
        type:Schema.Types.ObjectId,
        ref:'AcademicFaculty',
        required:true,
    },
    syncId:{
      type:String,
      require:true
    }
   
},
{
    timestamps:true,
    toJSON:{
        virtuals:true
    }
})

export const AcademicDepartment = model<IAcademicDepartment,AcademicDepartmentModel>('AcademicDepartment',academicDepartment);