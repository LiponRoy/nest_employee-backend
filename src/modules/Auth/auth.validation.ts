import { z } from 'zod';

const userValidationZodSchema = z.object({
	body: z.object({
		name: z
			.string()
			.min(4, { message: 'Name must be at least 4 characters long' })
			.regex(/^[A-Za-z]+$/, {
				message: 'Name must contain only alphabetic characters',
			}),
		email: z.string().email({ message: 'Invalid email address' }),
		password: z
			.string()
			.min(5, { message: 'Password must be at least 5 characters' }),

		role: z.enum(['admin', 'user']).default('user'),
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
