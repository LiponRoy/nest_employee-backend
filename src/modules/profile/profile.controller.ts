import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { profileServices } from './profile.service';

import { catchAsyncError } from '../../utils/catchAsyncErrors';
import { Request, Response } from 'express';

const profileCreate = catchAsyncError(async (req: Request, res: Response) => {
	const { ...profileInfo } = req.body;

	const profileData = await profileServices.profileCreate(
		profileInfo,
		req.user
	);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'profile Create Successfully',
		data: profileData,
	});
});

export const profileControllers = {
	profileCreate,
};
