import { model, Schema } from "mongoose";
import { ISuperAdmin, SuperAdminModel } from "./interface";  

const superAdminSchema = new Schema<ISuperAdmin, SuperAdminModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        middleName: {
          type: String,
          required: false,
        },
      },
      required: true,
    },
    dateOfBirth: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    contactNo: {
      type: String,
      unique: true,
      required: true,
    },
    emergencyContactNo: {
      type: String,
      required: true,
    },
    presentAddress: {
      type: String,
      required: true,
    },
    permanentAddress: {
      type: String,
      required: true,
    },
    managementDepartment: {
      type: Schema.Types.ObjectId,
      ref: "ManagementDepartment",
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
    },
    // Additional Fields for Super Admin
    
    isSuperAdmin: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      default: ["manage-users", "manage-settings", "full-access"],
    },
  },
  {
    timestamps: true,
  }
);

export const SuperAdmin = model<ISuperAdmin, SuperAdminModel>("SuperAdmin", superAdminSchema);
