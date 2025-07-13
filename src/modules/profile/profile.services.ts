import { JwtPayload } from 'jsonwebtoken';
import { IgeneralInfo } from './profile.interface';
import { profileModel } from './profile.model';
import ApiError from '../../errors/ApiError';
import mongoose from 'mongoose';

const getProfileDataById = async (
currentUser: JwtPayload
) => {
	const loginUser = currentUser?.userId;

	if (!mongoose.Types.ObjectId.isValid(loginUser)) {
        throw new ApiError(400, 'Invalid user ID format');
}
	const profileData = await profileModel.findOne({ userId: loginUser });

	if (!profileData) {
		throw new ApiError(400, 'Failed to get profile data');
	}

	return profileData;
};

const generalInfoUpdate = async (
	payload: IgeneralInfo,
	currentUser: JwtPayload
) => {
	const { phone, gender, age, bio, address, about } = payload;
	const loginUser = currentUser.userId;

	const checkProfile = await profileModel.findOne({ userId: loginUser });
	// If user not found
	if (!checkProfile) {
		throw new ApiError(400, 'User not found');
	}
	
	const updatedProfile = await profileModel.findOneAndUpdate(
		{ userId: loginUser },
		{
			$set: {
				generalInfo: {
					phone,
					gender,
					age,
					bio,
					address,
					about,
				},
			},
		},
		{ new: true }
	);

	// If failed to update profile
	if (!updatedProfile) {
		throw new ApiError(400, 'Failed to Update Profile');
	}

	return updatedProfile;
};

const updateSkills = async (skills: string[], currentUser: JwtPayload) => {
	const loginUser = currentUser.userId;

	const updatedProfile = await profileModel.findOneAndUpdate(
		{ userId: loginUser },
		{
			$set: {
				skills,
			},
		},
		{ new: true }
	);

	if (!updatedProfile) {
		throw new ApiError(400, 'Failed to Update Skills');
	}

	return updatedProfile;
};

interface IEducationPayload {
	education: {
		collegeName: string;
		cgpa: string;
		passingYear: number;
	}[];
}

const updateEducation = async (
	payload: IEducationPayload,
	currentUser: JwtPayload
) => {
	const loginUser = currentUser.userId;

	const updatedProfile = await profileModel.findOneAndUpdate(
		{ userId: loginUser },
		{ $set: { education: payload.education } },
		{ new: true }
	);

	if (!updatedProfile) {
		throw new ApiError(400, 'Failed to Update Education');
	}

	return updatedProfile;
};

interface IExperiencePayload {
	experience: {
		organizationName: string;
		yearsOfExperience: number;
		position: string;
	}[];
}

const updateExperience = async (
	payload: IExperiencePayload,
	currentUser: JwtPayload
) => {
	const loginUser = currentUser.userId;

	const updatedProfile = await profileModel.findOneAndUpdate(
		{ userId: loginUser },
		{ $set: { experience: payload.experience } },
		{ new: true }
	);

	if (!updatedProfile) {
		throw new ApiError(400, 'Failed to Update Experience');
	}

	return updatedProfile;
};

export const profileServices = {
	getProfileDataById,
	generalInfoUpdate,
	updateSkills,
	updateEducation,
	updateExperience,
};
