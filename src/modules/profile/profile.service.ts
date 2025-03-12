import { JwtPayload } from 'jsonwebtoken';
import { IProfile } from './profile.interface';

const profileCreate = async (payload: IProfile, currentUser: JwtPayload) => {};

export const profileServices = {
	profileCreate,
};
