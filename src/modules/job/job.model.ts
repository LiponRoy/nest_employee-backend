import mongoose, { Schema, model } from 'mongoose';
import { IJob } from './job.interface';

const jobSchema = new Schema<IJob>(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		requirements: [
			{
				type: String,
			},
		],
		salary: {
			type: Number,
			required: true,
		},
		experienceLevel: {
			type: Number,
			required: true,
		},
		location: {
			type: String,
			required: true,
		},
		jobType: {
			type: String,
			required: true,
		},
		position: {
			type: Number,
			required: true,
		},
		company: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Company',
			required: true,
		},
		created_by: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		applications: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Application',
			},
		],
	},
	{
		timestamps: true,
	}
);

export const JobModel = model<IJob>('Job', jobSchema);
