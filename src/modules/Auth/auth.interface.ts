import { Document, Model } from 'mongoose';
import { UserRole } from '../../enums/user';

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: UserRole.JOB_SEEKER | UserRole.EMPLOYER | UserRole.ADMIN;
}

export interface ILoginUser {
	email: string;
	password: string;
}

export interface IUserModel extends Model<IUser> {
	isUserExistsByEmail(email: string): Promise<IUser | null>;
	//instance methods for checking if passwords are matched
	isPasswordMatched(
		plainTextPassword: string,
		hashedPassword: string
	): Promise<boolean>;
}
