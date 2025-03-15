import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { catchAsyncError } from '../utils/catchAsyncErrors';
import ApiError from '../errors/ApiError';
import { UserModel } from '../modules/auth/auth.model';

export const isAuthenticated = () => {
	return catchAsyncError(
		async (req: Request, res: Response, next: NextFunction) => {
			const token = req.cookies.authToken; // Get token from the cookie

			if (!token) {
				return res.status(401).json({ message: 'No token provided' });
			}

			try {
				const decoded = jwt.verify(
					token,
					config.jwt_auth_secret as string
				) as JwtPayload;
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

// const auth = (...requiredRoles: any) => {
// 	return catchAsyncError(
// 		async (req: Request, res: Response, next: NextFunction) => {
// 			try {
// 				const token = req.cookies.authToken;

// 				// checking if the token is missing
// 				if (!token) {
// 					throw new ApiError(
// 						httpStatus.UNAUTHORIZED,
// 						'You are not authorized!'
// 					);
// 				}
// 				// Verify the token
// 				const decoded = jwt.verify(
// 					token,
// 					config.jwt_auth_secret as string
// 				) as JwtPayload;

// 				const { email, role } = decoded;

// 				// Check if the user has the required roles
// 				if (requiredRoles && !requiredRoles.includes(role)) {
// 					throw new ApiError(
// 						httpStatus.UNAUTHORIZED,
// 						'You are not authorized  hi!'
// 					);
// 				}
// 				// Attach the user payload to the request object
// 				req.user = decoded as JwtPayload & { role: string };
// 				// Proceed to the next middleware or controllers
// 				next();
// 			} catch (error) {
// 				throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token !');
// 			}
// 		}
// 	);
// };

//export default auth;
