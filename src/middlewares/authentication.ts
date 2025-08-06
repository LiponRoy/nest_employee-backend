import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt from 'jsonwebtoken';
import config from '../config';
import { catchAsyncError } from '../utils/catchAsyncErrors';
import ApiError from '../errors/ApiError';
import { UserJwtPayload } from '@modules/auth/auth.interface';

export const isAuthenticated = () => {
	return catchAsyncError(
		async (req: Request, res: Response, next: NextFunction) => {
			const token = req.cookies.authToken; // Get token from the cookie

			if (!token) {
				return res.status(401).json({ message: 'You are not login' });
			}

			try {
				const decoded = jwt.verify(
  token,
  config.jwt_auth_secret as string
) as UserJwtPayload;
				req.user = decoded; // Add decoded info to request object
				// console.log(' req.user id ....:', req.user.userId);
				// console.log(' req.user role....:', req.user.userRole);
				next();
			} catch (error) {
				return res.status(401).json({ message: 'Invalid or expired token' });
			}
		}
	);
};

// Handling users roles
export const authorizeRoles = (...roles: any) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.userRole)) {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				`Role (${req.user.userRole}) is not allowed to acccess this resource`
			);
		}
		next();
	};
};
