import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { IJob } from './job.interface';
import { JobModel } from './job.model';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';

const jobCreate = async (
	payload: IJob
	// companyId: string,
	// currentUser: JwtPayload
) => {
	const { title, company, created_by } = payload;

	const session = await mongoose.startSession();

	try {
		session.startTransaction();
		// Check if job exists
		const job = await JobModel.findOne({ title }).session(session);

		if (job) {
			throw new ApiError(409, 'This job already exists');
		}

		// create job
		const newJob = new JobModel({
			...payload,
			company: company,
			created_by: created_by,
		});

		await newJob.save({ session });

		// If failed to create an job
		if (!newJob) {
			throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create job');
		}

		// Commit the transaction
		await session.commitTransaction();

		return {
			newJob,
		};
	} catch (error: any) {
		// Rollback the transaction in case of an error
		await session.abortTransaction();
		throw new ApiError(
			400,
			error.message || 'An error occurred while creating the job.'
		);
	} finally {
		// Ensure the session is always ended
		session.endSession();
	}
};

const allJob = async () => {
	const jobs = await JobModel.find();

	if (!jobs) {
		throw new ApiError(409, 'jobs not found .');
	}

	return jobs;
};

export const JobServices = {
	jobCreate,
	allJob,
};
