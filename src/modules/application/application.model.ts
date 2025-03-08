import mongoose, { Schema, model } from 'mongoose';
import { IApplication } from './application.interface';

const applicationSchema = new Schema<IApplication>(
	{
		job: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Job',
			required: true,
		},
		applicant: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		status: {
			type: String,
			enum: ['pending', 'accepted', 'rejected'],
			default: 'pending',
		},
	},
	{
		timestamps: true,
	}
);

export const ApplicationModel = model<IApplication>(
	'Application',
	applicationSchema
);
