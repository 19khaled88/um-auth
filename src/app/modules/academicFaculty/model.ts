import { Model, Schema, model } from "mongoose";
import { IAcademicFaculty } from "./interface";
import { AcademicFacultyModel } from "../../../interfaces/common";

const academicFacultySchema = new Schema<IAcademicFaculty>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    syncId:{
      type:String,
      require:true
    }

  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const AcademicFaculty = model<IAcademicFaculty, AcademicFacultyModel>(
  "AcademicFaculty",
  academicFacultySchema
);
