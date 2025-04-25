import httpStatus from 'http-status';
import ApiError from '../../errors/ApiError';
import { IJob } from './job.interface';
import { JobModel } from './job.model';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { CompanyModel } from '../company/company.model';
import cloudinary from '../../utils/cloudinary';

const jobCreate = async (payload: any, photoFile: any) => {
	const { title, created_by, companyName } = payload;

	const session = await mongoose.startSession();

	try {
		session.startTransaction();
		// Check if job exists
		const job = await JobModel.findOne({ title }).session(session);

		if (job) {
			throw new ApiError(409, 'This job already exists');
		}

		// getting company _id by company name
		const companyData = await CompanyModel.findOne({
			name: companyName,
		}).session(session);

		if (!companyData) {
			throw new ApiError(409, 'company Data not found');
		}

		// Prepare for Cloudinary upload
		let result: any = null;
		if (photoFile) {
			try {
				// Upload image to Cloudinary
				result = await cloudinary.uploader.upload(photoFile.path, {
					folder: 'nest-emp-img',
					transformation: [
						{ width: 800, height: 800, crop: 'limit' }, // Resize image
						{ quality: 'auto', fetch_format: 'auto' }, // Optimize quality and format
					],
				});
			} catch (cloudinaryError) {
				throw new ApiError(500, 'Failed to upload image to Cloudinary');
			}
		}

		// create job
		const newJob = new JobModel({
			...payload,
			companyId: companyData?._id.toString(),
			created_by: created_by,
			logoImage: result?.secure_url,
			cloudinary_id: result?.public_id,
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
		// Roleback the transaction in case of an error
		await session.abortTransaction();
		throw new ApiError(400, error);
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

const getJobByCreator = async (currentUser: JwtPayload) => {
	console.log('job cus:', currentUser);
	const loginUser = currentUser?.userId;
	const Job = await JobModel.find({ created_by: loginUser });

	if (!Job) {
		throw new ApiError(409, 'Job not found');
	}
	return Job;
};

export const JobServices = {
	jobCreate,
	allJob,
	getJobByCreator,
};
