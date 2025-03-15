import mongoose, { Schema, model } from 'mongoose';
import { IProfile } from './profile.interface';

const profileSchema = new Schema<IProfile>(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		phone: { type: String },
		bio: { type: String },
		address: { type: String },
		about: { type: String },
		skills: { type: [String] },
		education: { type: [String] },
		experience: { type: [String] },
	},
	{
		timestamps: true,
	}
);

export const profileModel = model<IProfile>('Profile', profileSchema);
