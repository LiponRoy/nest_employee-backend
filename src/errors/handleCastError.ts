import mongoose, { Mongoose } from 'mongoose';
import { IGenericErrorResponse } from '../interfaces/common';

const handleCastError = (
	err: mongoose.Error.CastError
): IGenericErrorResponse => {
	//console.log('Cast Err......', err);
	const castErr = [
		{
			path: `Invalid.${err?.path}:${err?.value}`,
			message: err?.message,
		},
	];

	const statusCode = 400;
	return {
		statusCode,
		message: 'Invalid ID [Cast Error]',
		errorMessage: castErr,
	};
};
export default handleCastError;
