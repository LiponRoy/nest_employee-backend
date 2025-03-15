import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { profileServices } from './profile.service';

import { catchAsyncError } from '../../utils/catchAsyncErrors';
import { Request, Response } from 'express';

const profileUpdate = catchAsyncError(async (req: Request, res: Response) => {
	const { ...profileInfo } = req.body;

	const profileData = await profileServices.profileUpdate(
		profileInfo,
		req.user
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'profile Update Successfully',
		data: profileData,
	});
});

export const profileControllers = {
	profileUpdate,
};
