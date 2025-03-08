import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { catchAsyncError } from '../../utils/catchAsyncErrors';
import { Request, Response } from 'express';
import { ApplicationServices } from './application.service';

const applicationCreate = catchAsyncError(
	async (req: Request, res: Response) => {
		const { ...applicationInfo } = req.body;
		const { jobId } = req.params;

		const applicationData = await ApplicationServices.applicationCreate(
			applicationInfo,
			jobId,
			req.user
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: 'application Create Successfully',
			data: applicationData,
		});
	}
);

export const applicationControllers = {
	applicationCreate,
};
