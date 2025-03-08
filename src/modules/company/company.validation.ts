import { Types } from 'mongoose';
import { z } from 'zod';

const companyValidationZodSchema = z.object({
	body: z.object({
		name: z
			.string()
			.min(2, { message: 'Name must be at least 2 characters long' }),

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
