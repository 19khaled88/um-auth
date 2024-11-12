import { model, Schema } from "mongoose";
import { IManagementDepartment, ManagementDepartmentModel } from "./interface";

const ManagementSchema = new Schema<
  IManagementDepartment,
  ManagementDepartmentModel
>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const ManagementDepartment = model<
  IManagementDepartment,
  ManagementDepartmentModel
>("ManagementDepartment", ManagementSchema);
