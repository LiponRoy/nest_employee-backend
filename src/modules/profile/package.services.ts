import { JwtPayload } from 'jsonwebtoken';
import { IgeneralInfo } from './profile.interface';
import { profileModel } from './profile.model';
import ApiError from '../../errors/ApiError';

const generalInfoUpdate = async (
	payload: IgeneralInfo,
	currentUser: JwtPayload
) => {
	const { phone, gender, age, bio, address, about } = payload;
	const loginUser = currentUser.userId;

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
	generalInfoUpdate,
	updateEducation,
	updateExperience,
};
