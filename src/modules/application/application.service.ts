import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { IApplication } from './application.interface';
import { ApplicationModel } from './application.model';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { JobModel } from '../job/job.model';

const applicationCreate = async (
	payload: IApplication,
	jobId: string,
	currentUser: JwtPayload
) => {
	const session = await mongoose.startSession();
	try {
		session.startTransaction();

		const allreadyApply = await ApplicationModel.findOne({
			job: jobId,
			applicant: currentUser.userId,
		}).session(session);

		if (allreadyApply) {
			throw new ApiError(400, 'You have already applied for this job');
		}

		// create application
		const newApplication = await new ApplicationModel({
			job: jobId,
			applicant: currentUser.userId,
		}).save({ session });

		// If failed to create an application
		if (!newApplication) {
			throw new ApiError(
				httpStatus.BAD_REQUEST,
				'Failed to create application'
			);
		}

		// Update the JobModel's applications
		const JobModelUpdate = await JobModel.findByIdAndUpdate(
			jobId,
			{ $push: { applications: newApplication._id } },
			{ session }
		);

		if (!JobModelUpdate) {
			throw new ApiError(500, 'Failed to update Job.');
		}

		// Commit the transaction
		await session.commitTransaction();

		return {
			newApplication,
		};
	} catch (error: any) {
		await session.abortTransaction();
		throw new ApiError(
			400,
			error.message || 'An error occurred while apply for job'
		);
	} finally {
		session.endSession();
	}
};

const gettingAppliedJobsForUser = async (currentUser: JwtPayload) => {
	const application = await ApplicationModel.find({
		applicant: currentUser?.userId,
	})
		.populate({
			path: 'job',
			select: 'title description', // add multiple fields separated by space
		})
		.populate({
			path: 'status',
			// select: 'title description', // add multiple fields separated by space
		});

	if (!application || application.length === 0) {
		throw new ApiError(400, 'You do not have any applied jobs');
	}
	return application;
};

export const ApplicationServices = {
	applicationCreate,
	gettingAppliedJobsForUser,
};
