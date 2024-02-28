import {z} from 'zod';

export const userRegistrationSchema = z.object({
    name:z.string({
        required_error:'Name is required'
    }),
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().regex(new RegExp(/^(?=.*[A-Z])(?=.*\d.*\d.*\d).{8,}$/),"Password must contain at least 8 characters, minimum 1 uppercase letter, and minimum 3 numbers"),
    role:z.enum(['admin','user']).optional()
})

export const userLoginSchema = z.object({
    email:z.string({
        required_error:"Email is required"
    }),
    password:z.string({
        required_error:'Password is required'
    })
})

