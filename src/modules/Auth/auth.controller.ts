import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import config from '../../config';
import { catchAsyncError } from '../../utils/catchAsyncErrors';
import { Request, Response } from 'express';

const signupUser = catchAsyncError(async (req: Request, res: Response) => {
	const { ...user } = req.body;

	const newUser = await AuthServices.signupUser(user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'User Registered Successfully',
		data: newUser,
	});
});

const loginUser = catchAsyncError(async (req: Request, res: Response) => {
	const result = await AuthServices.loginUser(req.body);
	const { authToken, user } = result;

	res.cookie('authToken', authToken, {
		secure: config.node_env === 'production',
		httpOnly: true,
		sameSite: 'strict',
		maxAge: 1000 * 60 * 60 * 24 * 365,
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'User is logged in successfully!',
		data: {
			user,
			authToken,
		},
	});
});

const logout = catchAsyncError(async (req: Request, res: Response) => {
	//res.clearCookie('refressToken');
	res.cookie('authToken', null, {
		expires: new Date(Date.now()),
		httpOnly: true,
	});

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'User Logged out',
		data: [],
	});
});

const profile = catchAsyncError(async (req: Request, res: Response) => {
	const { userId } = req.user;
	const result = await AuthServices.profile(userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: 'Profile is retrieved successfully',
		data: result,
	});
});

export const AuthControllers = {
	signupUser,
	loginUser,
	logout,
	profile,
};
