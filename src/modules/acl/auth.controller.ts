import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import config from '../../config';
import { catchAsyncError } from '../../utils/catchAsyncErrors';
import { Request, Response } from 'express';
import { AuthServices } from './auth.service';

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

const isProduction = config.node_env === 'production';

	res.cookie('authToken', authToken, {
	httpOnly: true,
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'none' : 'lax', // cross-origin support only in prod
    maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
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

	const isProduction = config.node_env === 'production';

      res.clearCookie('authToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/', // ensure same path
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
