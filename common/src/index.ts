import z from 'zod';

export const signupInput = z.object({
    email: z.string().email(),
    password : z.string().min(6, "min 6 letter required")
})

export type signuppInput = z.infer<typeof signupInput>


export const signinInput = z.object({
    email: z.string().email(),
    password : z.string().min(6, "min 6 letter required")
})

export type signinInput = z.infer<typeof signinInput>


export const createPostInput = z.object({
    title: z.string(),
    content : z.string()
})

export type createPostInput = z.infer<typeof signupInput>