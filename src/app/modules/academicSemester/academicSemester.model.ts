import { Model, Schema, model } from "mongoose";
import { UserModel } from "../../../interfaces/common";
import {
  AcademicSemesterModel,
  IAcademicSemester,
} from "./academicSemester.interface";
import { code, month, title } from "./academicSemester.constant";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";

// const month =["January", "February", "March" , "April", "May", "June", "July", "August" , "September" , "October", "November", "December"]
const academicSemesterSchema = new Schema<IAcademicSemester>(
  {
    title: {
      type: String,
      required: true,
      enum: title,
    },
    year: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
      enum: code,
    },
    startMonth: {
      type: String,
      required: true,
      enum: month,
    },
    endMonth: {
      type: String,
      required: true,
      enum: month,
    },
  },
  {
    timestamps: true,
    toJSON:{
      virtuals:true
  }
  }
);

// pre hook
academicSemesterSchema.pre("save", async function (next) {
  try {
    const isExist = await AcademicSemester.findOne({
      title: this.title,
      year: this.year,
    });
    if (isExist) {
      return next(
        new ApiError(httpStatus.CONFLICT, "Academic semester already exists!")
      );
    }
    next(); // Proceed if no existing semester found
  } catch (error: unknown) {
    console.error("Error in pre-save hook:", error);
    if (error instanceof Error) {
      return next(
        new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message)
      );
    }
    return next(
      new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "An unknown error occurred."
      )
    );
  }
});

export const AcademicSemester = model<IAcademicSemester, AcademicSemesterModel>(
  "AcademicSemester",
  academicSemesterSchema
);
