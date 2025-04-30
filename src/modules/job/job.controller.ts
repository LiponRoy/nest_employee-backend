import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { catchAsyncError } from '../../utils/catchAsyncErrors';
import { Request, Response } from 'express';
import { JobServices } from './job.service';

const jobCreate = catchAsyncError(async (req: Request, res: Response) => {
	const { ...jobInfo } = req.body;

	const jobData = await JobServices.jobCreate(jobInfo, req.file);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'job Create Successfully',
		data: jobData,
	});
});
const allJob = catchAsyncError(async (req: Request, res: Response) => {
	const jobData = await JobServices.allJob();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'jobs Getting Successfully',
		data: jobData,
	});
});

const getJobByCreator = catchAsyncError(async (req: Request, res: Response) => {
	const jobData = await JobServices.getJobByCreator(req.user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'job Getting Successfully',
		data: jobData,
	});
});

const getJobById = catchAsyncError(async (req: Request, res: Response) => {
	const jobData = await JobServices.getJobById(req.params.id);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'job Getting Successfully',
		data: jobData,
	});
});

export const JobControllers = {
	jobCreate,
	allJob,
	getJobByCreator,
	getJobById,
};
