import mongoose, { Schema, model } from 'mongoose';
import { IJob } from './job.interface';

const jobSchema = new Schema<IJob>(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },

		requirements: [{ title: String }],
		responsibility: [{ title: String }],
		salaryAndBenefits: [{ title: String }],
		skillAndExperience: [{ title: String }],

		minSalary: { type: Number, required: true },
		maxSalary: { type: Number, required: true },

		experienceLevel: { type: Number, required: true },
		location: { type: String, required: true },
		jobType: { type: String, required: true },
		category: { type: String, required: true },

		// position: { type: Number, required: true },
		datePosted: { type: String, required: true },
		dateDeadline: { type: String, required: true },
		vacancy: { type: Number, required: true },
		educationQualification: { type: String, required: true },
		gender: { type: String, required: true },
		companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
		created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		applications: [{ type: Schema.Types.ObjectId, ref: 'Application' }],
		logoImage: {
			type: String,
		},
		cloudinary_id: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

export const JobModel = model<IJob>('Job', jobSchema);
