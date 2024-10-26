import { z } from "zod"

const academicSemesterSchema = z.object({
    year: z.number({
      required_error: "Year is required, if role is student",
    }),
    code: z.string({
      required_error: "Code is required, if role is student",
    })
  });



const createdUserZodSchema = z.object({
    body: z.object({
        user: z.object({
            role: z.string({
                required_error: 'role is required'
            }),
            password: z.string().optional(),
        }),
        academicSemester: academicSemesterSchema.optional()
    }).refine((data)=>{
        if(data.user.role === 'student' && !data.academicSemester){
            return false;
        }
        return true
    },{
        message:'Academic semester element are requied for student role',
        path:['academicSemester']
    })
})

export const UserValidation ={
    createdUserZodSchema
}