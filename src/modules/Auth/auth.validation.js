"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const userValidationZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(2, { message: 'Name must be at least 2 characters long' }),
        email: zod_1.z.string().email({ message: 'Invalid email address' }),
        password: zod_1.z
            .string()
            .min(5, { message: 'Password must be at least 5 characters' }),
        role: zod_1.z.enum(['job_seeker', 'employer']).default('job_seeker'),
    }),
});
const loginValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email({ message: 'Invalid email address' }),
        password: zod_1.z.string({ required_error: 'Password is required' }),
    }),
});
exports.AuthValidation = {
    userValidationZodSchema,
    loginValidationSchema,
};
