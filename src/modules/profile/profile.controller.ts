import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';

import { catchAsyncError } from '../../utils/catchAsyncErrors';
import { Request, Response } from 'express';
import { profileServices } from './package.services';

const generalInfoUpdate = catchAsyncError(
	async (req: Request, res: Response) => {
		const { ...profileInfo } = req.body;

		const profileData = await profileServices.generalInfoUpdate(
			profileInfo,
			req.user
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: 'profile general info Update Successfully',
			data: profileData,
		});
	}
);

const updateEducation = catchAsyncError(async (req: Request, res: Response) => {
	const educationData = req.body;

	const result = await profileServices.updateEducation(educationData, req.user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Education updated successfully',
		data: result.education,
	});
});

export const profileControllers = {
	generalInfoUpdate,
	updateEducation,
};
