import { ErrorRequestHandler } from 'express';
import config from '../config';
import handleValidationError from '../errors/handleValidationError';
import { IGenericErrorMessage } from '../interfaces/error';
import ApiError from '../errors/ApiError';
import handleZodError from '../errors/handleZodError';
import { ZodError } from 'zod';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
	let statusCode = 500;
	let message = 'Something went wrong';
	let errorMessage: IGenericErrorMessage[] = [];
	// For Validation error
	if (error.name === 'ValidationError') {
		const simplifiedError = handleValidationError(error);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorMessage = simplifiedError.errorMessage;
	} else if (error instanceof ZodError) {
		const zodErr = handleZodError(error);
		statusCode = zodErr.statusCode;
		message = zodErr.message;
		errorMessage = zodErr.errorMessage;
		// Wrong Mongoose Object ID Error
	} else if (error.name === 'CastError') {
		const simplifiedError = handleCastError(error);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorMessage = simplifiedError.errorMessage;
		// Handling Mongoose duplicate key errors
	} else if (error.code === 11000) {
		const simplifiedError = handleDuplicateError(error);
		statusCode = simplifiedError.statusCode;
		message = simplifiedError.message;
		errorMessage = simplifiedError.errorMessage;
	} else if (error instanceof ApiError) {
		statusCode = error?.statusCode;
		message = error?.message;
		errorMessage = error?.message
			? [
					{
						path: '',
						message: error.message,
					},
			  ]
			: [];
		// Handling wrong JWT error
	} else if (error.name === 'JsonWebTokenError') {
		statusCode = 400;
		message = 'JSON Web Token is invalid. Try Again!!!';
		errorMessage = message
			? [
					{
						path: '',
						message: 'JSON Web Token is invalid. Try Again!!!',
					},
			  ]
			: [];
		// for normal Error class
	} else if (error.name === 'TokenExpiredError') {
		statusCode = 400;
		message = 'JSON Web Token is expired. Try Again!!!';
		errorMessage = message
			? [
					{
						path: '',
						message: 'JSON Web Token is expired. Try Again!!!',
					},
			  ]
			: [];
		// for normal Error class
	} else if (error instanceof Error) {
		message = error?.message;
		errorMessage = error?.message
			? [
					{
						path: '',
						message: error?.message,
					},
			  ]
			: [];
	}

	res.status(statusCode).json({
		success: false,
		message,
		errorMessage,
		stack: error.stack,
	});
};

export default globalErrorHandler;
