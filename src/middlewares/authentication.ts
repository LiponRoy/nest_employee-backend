import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { catchAsyncError } from '../utils/catchAsyncErrors';
import ApiError from '../errors/ApiError';
import { UserModel } from '../modules/Auth/auth.model';

export const isAuthenticated = () => {
	return catchAsyncError(
		async (req: Request, res: Response, next: NextFunction) => {
			const token = req.cookies.authToken;
			// checking if the token is missing
			if (!token) {
				throw new ApiError(
					httpStatus.UNAUTHORIZED,
					'Login first to access this resource.'
				);
			}

			try {
				// Verify the token
				const decoded = jwt.verify(
					token,
					config.jwt_auth_secret as string
				) as JwtPayload;

				console.log('decoded ', decoded);

				// Attach the user payload to the request object
				req.user = (await UserModel.isUserExistsByEmail(
					decoded.email
				)) as JwtPayload;

				console.log('req.user ', req.user.role);

				// Proceed to the next middleware or controllers
				next();
			} catch (error) {
				throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token !');
			}
		}
	);
};

// Handling users roles
export const authorizeRoles = (...roles: any) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.role)) {
			throw new ApiError(
				httpStatus.UNAUTHORIZED,
				`Role (${req.user.role}) is not allowed to acccess this resource`
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
