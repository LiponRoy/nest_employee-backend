import mongoose, { Schema, model } from 'mongoose';
import { ICompany } from './company.interface';

const companySchema = new Schema<ICompany>(
	{
		name: { type: String, required: true },
		title: { type: String, required: true },
		about: { type: String, required: true },
		website: { type: String, required: true },
		location: { type: String, required: true },
		teamMember: { type: Number, required: true },
		officeBranches: { type: Number, required: true },
		FoundedDate: { type: String, required: true },
		jobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
		creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	},
	{
		timestamps: true,
	}
);

export const CompanyModel = model<ICompany>('Company', companySchema);
