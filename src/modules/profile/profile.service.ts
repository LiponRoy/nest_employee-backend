import { JwtPayload } from 'jsonwebtoken';
import { IProfile } from './profile.interface';
import { profileModel } from './profile.model';
import ApiError from '../../errors/ApiError';

const profileUpdate = async (payload: IProfile, currentUser: JwtPayload) => {
	const updatedProfile = await profileModel.findOneAndUpdate(
		{ userId: currentUser.userId },
		payload,
		{ new: true, runValidators: true }
	);

	// If failed to update profile
	if (!updatedProfile) {
		throw new ApiError(400, 'Failed to create job');
	}

	return updatedProfile;
};

export const profileServices = {
	profileUpdate,
};
