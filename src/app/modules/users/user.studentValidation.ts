import { string, z } from "zod";
import { bloodGroup, personality } from "../student/constans";

const createStudentZodSchema = z.object({
  body: z.object({
    password: z.string().optional(),
    student: z.object({
      name: z.object({
        firstName: z.string({
          required_error: "First name is required",
        }),
        middleName: z
          .string({
            required_error: "Middle name is required",
          })
          .optional(),
        lastName: z.string({
          required_error: "Last name is required",
        }),
      }),
      dateOfBirth: z.string({
        required_error: "Date of birth is required",
      }),
      gender: z.enum([...personality] as [string, ...string[]], {
        required_error: "Gender is required",
      }),
      bloodGroup: z.enum([...bloodGroup] as [string, ...string[]], {
        required_error: "Blood group is required",
      }).optional(),
      email: z
        .string({
          required_error: "Email is required!",
        })
        .email(),
      contactNo: z.string({
        required_error: "Contact number is required",
      }),
      emergencyContactNo: z.string({
        required_error: "Emergency contact number is required",
      }),
      presentAddress:z.string({
        required_error:'Present address is required'
      }),
      permanentAddress:z.string({
        required_error:'Permanent address is required'
      }),
      academicSemester:z.string({
        required_error:'Academic semester is required'
      }),
      academicDepartment:z.string({
        required_error:'Academic Department is required'
      }),
      academicFaculty:z.string({
        required_error:'Academic faculty is required'
      }),
      guardian:z.object({
        fatherName:z.string({
            required_error:'Father name is required'
        }),
        fatherOccupation:z.string({
            required_error:'Father occupation is required'
        }),
        fatherContactNo:z.string({
            required_error:'Father contact no is required'
        }),
        motherName:z.string({
            required_error:'Mother name is required'
        }),
        motherContactNo:z.string({
            required_error:'Mother contact no is required'
        }),
        motherOccupation:z.string({
            required_error:'Mother occupation is required'
        }),
        address:z.string({
            required_error:'Guardian address is required'
        })
      }),
      localGuardian:z.object({
        
            name:z.string({
                required_error:'Local guardian name is required'
            }),
            occupation:z.string({
                required_error:'Guardian occupation name'
            }),
            contactNo:z.string({
                required_error:'Guardian contact is required'
            }),
            address:z.string({
                required_error:'Local guardian address is required'
            })
      }),
      profileImage:z.string({}).optional(),
    }),
    
  }),
});


export const UserZodValidation ={
    createStudentZodSchema
}
