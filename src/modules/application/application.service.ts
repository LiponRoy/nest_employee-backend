import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { IApplication } from './application.interface';
import { ApplicationModel } from './application.model';

const applicationCreate = async (payload: IApplication) => {
	// create application
	const newApplication = await ApplicationModel.create({
		...payload,
	});

	// If failed to create an application
	if (!newApplication) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create application');
	}

	return {
		newApplication,
	};
};

export const ApplicationServices = {
	applicationCreate,
};
