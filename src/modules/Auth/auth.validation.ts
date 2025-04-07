import { z } from 'zod';

const userValidationZodSchema = z.object({
	body: z.object({
		name: z
			.string()
			.min(2, { message: 'Name must be at least 2 characters long' }),
		email: z.string().email({ message: 'Invalid email address' }),
		password: z
			.string()
			.min(5, { message: 'Password must be at least 5 characters' }),

		role: z.enum(['job_seeker', 'employer']).default('job_seeker'),
	}),
});

const loginValidationSchema = z.object({
	body: z.object({
		email: z.string().email({ message: 'Invalid email address' }),
		password: z.string({ required_error: 'Password is required' }),
	}),
});

export const AuthValidation = {
	userValidationZodSchema,
	loginValidationSchema,
};
