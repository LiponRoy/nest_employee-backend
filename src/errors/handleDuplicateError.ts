import mongoose, { Mongoose } from 'mongoose';
import { IGenericErrorResponse } from '../interfaces/common';

const handleDuplicateError = (err: any): IGenericErrorResponse => {
	console.log('Duplicate Err......', err);
	// Extract value within double quotes using regex
	const match = err.message.match(/"([^"]*)"/);

	// The extracted value will be in the first capturing group
	const extractedMessage = match && match[1];

	const errorMessage = [
		{
			path: '',
			message: `${extractedMessage} is already exists`,
		},
	];

	const statusCode = 400;
	return {
		statusCode,
		message: 'Invalid ID [Cast Error]',
		errorMessage,
	};
};
export default handleDuplicateError;
