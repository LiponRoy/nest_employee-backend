import mongoose, { Schema, model } from 'mongoose';
import { ICompany } from './company.interface';

const companySchema = new Schema<ICompany>(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		description: {
			type: String,
		},
		website: {
			type: String,
		},
		location: {
			type: String,
		},
		creator: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export const CompanyModel = model<ICompany>('Company', companySchema);
