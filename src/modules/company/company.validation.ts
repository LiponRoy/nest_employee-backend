import { Types } from 'mongoose';
import { z } from 'zod';

const companyValidationZodSchema = z.object({
	body: z.object({
		name: z
			.string()
			.min(4, { message: 'Name must be at least 4 characters long' })
			.regex(/^[A-Za-z]+$/, {
				message: 'Name must contain only alphabetic characters',
			}),
		description: z
			.string()
			.min(1, { message: 'Name must be at least 1 characters long' }),
		website: z
			.string()
			.min(1, { message: 'Name must be at least 1 characters long' }),
		location: z
			.string()
			.min(1, { message: 'Name must be at least 1 characters long' }),
		userId: z.string().refine((val) => Types.ObjectId.isValid(val), {
			message: 'Invalid userId format',
		}),
	}),
});

export const CompanyValidation = {
	companyValidationZodSchema,
};
