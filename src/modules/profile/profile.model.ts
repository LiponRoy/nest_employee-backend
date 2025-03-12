import mongoose, { Schema, model } from 'mongoose';
import { IProfile } from './profile.interface';

const profileSchema = new Schema<IProfile>(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String, required: true },
		bio: { type: String, required: true },
		address: { type: String, required: true },
		about: { type: String, required: true },
		skills: { type: [String], required: true },
		education: { type: [String], required: true },
		experience: { type: [String], required: true },
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{
		timestamps: true,
	}
);

export const profileModel = model<IProfile>('Profile', profileSchema);
