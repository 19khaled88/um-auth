import { string, z } from "zod"
import { academicSemesterCode, academicSemesterMonth, academicSemesterTitle } from "./academicSemester.constant"


const academicSemesterZodSchema = z.object({
    body: z.object({
        title: z.enum([...academicSemesterTitle] as [string, ...string[]],{required_error:'Title is required'}),
        year: z.number({
            required_error:'Year is required'
        }),
        code: z.enum([...academicSemesterCode] as [string, ...string[]],{
            required_error:'code is required'
        }),
        startMonth: z.enum([...academicSemesterMonth] as [string, ...string[]],{
            required_error:'Start month is required'
        }),
        endMonth: z.enum([...academicSemesterMonth] as [string, ...string[]],{
            required_error:'End month is required'
        }),
    })
})

export const AcademicSemesterValidation ={
    academicSemesterZodSchema
}