import { Schema, model } from 'mongoose';
import { IUser, IUserModel } from './auth.interface';
import bcrypt from 'bcrypt';
import config from '../../config';
import { UserRole } from '../../enums/user';

const userSchema = new Schema<IUser>(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			select: 0,
		},
		role: {
			type: String,
			// JobSeeker,who can apply for job and update his profile
			// Employer, who can create company and create job post
			enum: [UserRole.JOB_SEEKER, UserRole.EMPLOYER, UserRole.ADMIN],
			default: UserRole.JOB_SEEKER,
		},
		myAppliedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
	},
	{
		timestamps: true,
	}
);

userSchema.pre('save', async function (next) {
	const user = this; // doc
	// hashing password and save into DB
	user.password = await bcrypt.hash(
		user.password,
		Number(config.bcrypt_salt_rounds)
	);
	next();
});

// Define the static method for isUserExistsByEmail
userSchema.statics.isUserExistsByEmail = async function (email: string) {
	return await userModel.findOne({ email }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
	plainTextPassword,
	hashedPassword
) {
	return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const userModel = model<IUser, IUserModel>('User', userSchema);
