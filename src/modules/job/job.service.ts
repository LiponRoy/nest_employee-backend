import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { IJob } from './job.interface';
import { JobModel } from './job.model';

const jobCreate = async (payload: IJob) => {
	const { title } = payload;
	// Check if job exists
	const job = await JobModel.findOne({ title });

	if (job) {
		throw new ApiError(409, 'This job already exists');
	}

	// create job
	const newJob = await JobModel.create({
		...payload,
	});

	// If failed to create an job
	if (!newJob) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create job');
	}

	return {
		newJob,
	};
};

export const JobServices = {
	jobCreate,
};
