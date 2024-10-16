import { z } from "zod"


const createdUserZodSchema = z.object({
    body: z.object({
        user: z.object({
            role: z.string({
                required_error: 'role is required'
            }),
            password: z.string().optional(),
        })
    })
})

export const UserValidation ={
    createdUserZodSchema
}