import { z } from "zod";
import { bloodGroup, personality } from "../student/constans";

const createStudentZodSchemna = z.object({
  body: z.object({
    password: z.string().optional(),
    student: z.object({
      name: z.object({
        firstName: z.string({
          required_error: "First name is required",
        }),
        middleName: z.string().optional(),
        lastName: z.string({
          required_error: "Last name is required",
        }),
      }),
      gender: z.enum([...personality] as [string, ...string[]], {
        required_error: "Gender is required",
      }),
      dataOfBirth: z.string({
        required_error: "Date of birth is required",
      }),
      email: z
        .string({
          required_error: "Email is required",
        })
        .email(),
      contactNo: z.string({
        required_error: "Contact number is required",
      }),
      emergencyContactNo: z.string({
        required_error: "Emergency contact number is requried",
      }),
      bloodGroup: z.enum([...bloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string({
        required_error: "Presend address is required",
      }),
      permanentAddress: z.string({
        required_error: "Permanent address is required",
      }),
      academicSemester: z.string({
        required_error: "Academic Semester is required",
      }),
      academicDepartment: z.string({
        required_error: "Academic department is required",
      }),
      academicFaculty: z.string({
        required_error: "Academic faculty is required",
      }),
      guardian: z.object({
        fatherName: z.string({
          required_error: "Father name is required",
        }),
        fatherOccupation: z.string({
          required_error: "Father occupation is required",
        }),
        fatherContactNo: z.string({
          required_error: "Father contact number is required",
        }),
        motherName: z.string({
          required_error: "Mother name is required",
        }),
        motherOccupation: z.string({
          required_error: "Mother occupation is required",
        }),
        motherContactNo: z.string({
          required_error: "Mother contact number is required",
        }),
        address: z.string({
          required_error: "Guardian address is required",
        }),
      }),
      localGuardian: z.object({
        name: z.string({
          required_error: "Local guardian name is required",
        }),
        occupation: z.string({
          required_error: "Local guardian occupation is required",
        }),
        contactNo: z.string({
          required_error: "Local guardian contact number is required",
        }),
        address: z.string({
          required_error: "Local guardian address is required",
        }),
      }),
      profileImage: z.string().optional(),
    }),
  }),
});


const updateStudentZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    student: z
      .object({
        name: z
          .object({
            firstName: z
              .string({
                required_error: "First name is required",
              })
              .optional(),
            middleName: z
              .string({
                required_error: "Middle name is required",
              })
              .optional(),
            lastName: z
              .string({
                required_error: "Last name is required",
              })
              .optional(),
          })
          .optional(),
        dateOfBirth: z
          .string({
            required_error: "Date of birth is required",
          })
          .optional(),
        gender: z
          .enum([...personality] as [string, ...string[]], {
            required_error: "Gender is required",
          })
          .optional(),
        bloodGroup: z
          .enum([...bloodGroup] as [string, ...string[]], {
            required_error: "Blood group is required",
          })
          .optional(),
        email: z
          .string({
            required_error: "Email is required!",
          })
          .email()
          .optional(),
        contactNo: z
          .string({
            required_error: "Contact number is required",
          })
          .optional(),
        emergencyContactNo: z
          .string({
            required_error: "Emergency contact number is required",
          })
          .optional(),
        presentAddress: z
          .string({
            required_error: "Present address is required",
          })
          .optional(),
        permanentAddress: z
          .string({
            required_error: "Permanent address is required",
          })
          .optional(),
        academicSemester: z
          .string({
            required_error: "Academic semester is required",
          })
          .optional(),
        academicDepartment: z
          .string({
            required_error: "Academic Department is required",
          })
          .optional(),
        academicFaculty: z
          .string({
            required_error: "Academic faculty is required",
          })
          .optional(),
        guardian: z
          .object({
            fatherName: z
              .string({
                required_error: "Father name is required",
              })
              .optional(),
            fatherOccupation: z
              .string({
                required_error: "Father occupation is required",
              })
              .optional(),
            fatherContactNo: z
              .string({
                required_error: "Father contact no is required",
              })
              .optional(),
            motherName: z
              .string({
                required_error: "Mother name is required",
              })
              .optional(),
            motherContactNo: z
              .string({
                required_error: "Mother contact no is required",
              })
              .optional(),
            motherOccupation: z
              .string({
                required_error: "Mother occupation is required",
              })
              .optional(),
            address: z
              .string({
                required_error: "Guardian address is required",
              })
              .optional(),
          })
          .optional(),
        localGuardian: z
          .object({
            name: z
              .string({
                required_error: "Local guardian name is required",
              })
              .optional(),
            occupation: z
              .string({
                required_error: "Guardian occupation name is required",
              })
              .optional(),
            contactNo: z
              .string({
                required_error: "Guardian contact is required",
              })
              .optional(),
            address: z
              .string({
                required_error: "Local guardian address is required",
              })
              .optional(),
          })
          .optional(),
        profileImage: z.string({}).optional(),
      })
      .optional(),
  }),
});

export const StudentZodValidation = {

  createStudentZodSchemna,
  updateStudentZodSchema,
};
