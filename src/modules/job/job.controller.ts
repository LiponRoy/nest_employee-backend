import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { catchAsyncError } from '../../utils/catchAsyncErrors';
import { Request, Response } from 'express';
import { JobServices } from './job.service';
import queryFilter from '../../utils/queryFilter';
import {
	filterableFields,
	paginationsFields,
	searchableFields,
} from './job.constant';

const jobCreate = catchAsyncError(async (req: Request, res: Response) => {
	const { ...jobInfo } = req.body;

	const jobData = await JobServices.jobCreate(jobInfo);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'job Create Successfully',
		data: jobData,
	});
});

const allJob = catchAsyncError(async (req: Request, res: Response) => {
	const paginationOptions = queryFilter(req.query, paginationsFields);

	const filters = queryFilter(req.query, filterableFields);

	const result = await JobServices.allJob(filters, paginationOptions);

	sendResponse<any[]>(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Jobs get Successfully !',
		meta: result.meta,
		data: result.data,
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

const deleteJobById = catchAsyncError(async (req: Request, res: Response) => {
	const { jobId } = req.params;
	const jobData = await JobServices.deleteJobById(jobId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'delete Job Successfully',
		data: jobData,
	});
});



export const JobControllers = {
	jobCreate,
	allJob,
	getJobByCreator,
	getJobById,
	deleteJobById
};
