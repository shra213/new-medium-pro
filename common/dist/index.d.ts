import z from "zod";
export declare const signupInput: z.ZodObject<{
    name: z.ZodString;
    otp: z.ZodEffects<z.ZodNumber, number, number>;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    otp: number;
    email: string;
    password: string;
}, {
    name: string;
    otp: number;
    email: string;
    password: string;
}>;
export type signuppInput = z.infer<typeof signupInput>;
export declare const signinInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type signinInput = z.infer<typeof signinInput>;
export declare const createPostInput: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
}, {
    title: string;
    content: string;
}>;
export type createPostInput = z.infer<typeof signupInput>;
