// import { Document, Model, Types } from 'mongoose';
// import { UserRole } from '../../enums/user';

// export interface IUser extends Document {
// 	name: string;
// 	email: string;
// 	password: string;
// 	role: UserRole.JOB_SEEKER | UserRole.EMPLOYER | UserRole.ADMIN;
// 	myAppliedJobs:Types.ObjectId[];
// }

// export interface ILoginUser {
// 	email: string;
// 	password: string;
// }

// export interface IUserModel extends Model<IUser> {
// 	isUserExistsByEmail(email: string): Promise<IUser | null>;
// 	//instance methods for checking if passwords are matched
// 	isPasswordMatched(
// 		plainTextPassword: string,
// 		hashedPassword: string
// 	): Promise<boolean>;
// }
import { Types, Document, Model } from 'mongoose';
import { UserRole } from '../../enums/user';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole.JOB_SEEKER | UserRole.EMPLOYER | UserRole.ADMIN;
  myAppliedJobs: Types.ObjectId[];
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IUserModel extends Model<IUser> {
  isUserExistsByEmail(email: string): Promise<IUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}

/**
 * Used as the JWT payload
 * and assigned to req.user
 */
export interface UserJwtPayload {
  userId: string;
  userRole: UserRole;
  iat?: number;
  exp?: number;
}
