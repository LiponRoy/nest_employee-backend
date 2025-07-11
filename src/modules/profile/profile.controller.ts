import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';

import { catchAsyncError } from '../../utils/catchAsyncErrors';
import { Request, Response } from 'express';
import { profileServices } from './profile.services';

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

const updateSkills = catchAsyncError(async (req: Request, res: Response) => {
	const { skills } = req.body;

	const profileSkills = await profileServices.updateSkills(skills, req.user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Skills updated successfully',
		data: profileSkills?.skills,
	});
});

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

const updateExperience = catchAsyncError(
	async (req: Request, res: Response) => {
		const experienceData = req.body;

		const result = await profileServices.updateExperience(
			experienceData,
			req.user
		);

		sendResponse(res, {
			statusCode: httpStatus.OK,
			success: true,
			message: 'Experience updated successfully',
			data: result.experience,
		});
	}
);

export const profileControllers = {
	generalInfoUpdate,
	updateSkills,
	updateEducation,
	updateExperience,
};
