import mongoose, { Schema, model } from 'mongoose';
import { IProfile } from './profile.interface';

const profileSchema = new Schema<IProfile>(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		generalInfo: {
			phone: { type: String },
			gender: { type: String },
			age: { type: Number },
			bio: { type: String },
			address: { type: String },
			about: { type: String },
		},
		skills: { type: [String] },
		education: [
			{
				instituteName: { type: String },
				degree: { type: String },
				cgpa: { type: String },
				passingYear: { type: Number },
			},
		],
		experience: [
			{
				organizationName: { type: String },
				yearsOfExperience: { type: Number },
				position: { type: String },
			},
		],
	},
	{
		timestamps: true,
	}
);

export const profileModel = model<IProfile>('Profile', profileSchema);
