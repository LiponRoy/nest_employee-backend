import httpStatus from 'http-status';
import config from '../../config';
import jwt from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { IUser } from './auth.interface';
import { UserModel } from './auth.model';
import { createToken } from './auth.utils';

const signupUser = async (payload: IUser) => {
	const { email } = payload;
	// Check if user exists
	const user = await UserModel.isUserExistsByEmail(email);

	if (user) {
		throw new ApiError(409, 'User already exists');
	}

	// create user
	const newUser = await UserModel.create({
		...payload,
	});

	// If failed to create an user
	if (!newUser) {
		throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
	}

	return {
		newUser,
	};
};

const loginUser = async (payload: IUser) => {
	// checking if the user is exist
	const user = await UserModel.isUserExistsByEmail(payload.email);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'This user is not found !');
	}

	//checking if the password is correct
	if (!(await UserModel.isPasswordMatched(payload?.password, user?.password)))
		throw new ApiError(httpStatus.FORBIDDEN, 'Password do not matched');

	// Generate JWT token
	const authToken = jwt.sign(
		{ userId: user._id },
		config.jwt_auth_secret as string,
		{ expiresIn: '1h' }
	);

	return {
		authToken,
		user,
	};
};

const profile = async (email: string) => {
	const result = await UserModel.findOne({ email });
	return result;
};

export const AuthServices = {
	signupUser,
	loginUser,
	profile,
};
