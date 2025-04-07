import httpStatus from 'http-status';
import config from '../../config';
import jwt from 'jsonwebtoken';
import ApiError from '../../errors/ApiError';
import { IUser } from './auth.interface';
import { UserModel } from './auth.model';
import { createToken } from './auth.utils';
import { profileModel } from '../profile/profile.model';
import mongoose from 'mongoose';

const signupUser = async (payload: IUser) => {
	const session = await mongoose.startSession();
	session.startTransaction(); // Start the transaction

	try {
		const { email } = payload;
		// Check if user exists
		const user = await UserModel.isUserExistsByEmail(email);

		if (user) {
			throw new ApiError(409, 'User already exists');
		}

		// create user
		const newUser = new UserModel({
			...payload,
		});
		await newUser.save({ session });

		// Create empty profile with only userId
		const newProfile = new profileModel({ userId: newUser._id });
		await newProfile.save({ session });

		// If failed to create an user
		if (!newUser) {
			throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
		}

		// Commit transaction
		await session.commitTransaction();

		return {
			newUser,
		};
	} catch (error: any) {
		// Rollback the transaction in case of an error
		await session.abortTransaction();
		throw new ApiError(
			400,
			error.message || 'An error occurred while creating the product.'
		);
	} finally {
		// Ensure the session is always ended
		session.endSession();
	}
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
		{ userId: user._id, userRole: user.role },
		config.jwt_auth_secret as string,
		{ expiresIn: '1h' }
	);

	return {
		authToken,
		user,
	};
};

const profile = async (userId: string) => {
	const result = await UserModel.findOne({ _id: userId });
	return result;
};

export const AuthServices = {
	signupUser,
	loginUser,
	profile,
};
