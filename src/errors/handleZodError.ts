import { ZodError, ZodIssue } from 'zod';
import { IGenericErrorMessage } from '../interfaces/error';
import { IGenericErrorResponse } from '../interfaces/common';

const handleZodError = (err: ZodError): IGenericErrorResponse => {
	const errorZod: IGenericErrorMessage[] = err.issues.map((issue: ZodIssue) => {
		return {
			// pick second element of path array, that is why= issue?.path[1],
			path: issue?.path[1],
			message: issue?.message,
		};
	});
	const pth = errorZod.map((v: any) => v.path);
	const message = errorZod.map((v: any) => v.message).toString();

	return {
		statusCode: 400,
		message: 'Zod Error- ' + message,
		errorMessage: pth,
	};
};

export default handleZodError;
