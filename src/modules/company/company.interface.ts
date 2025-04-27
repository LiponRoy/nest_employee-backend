import { Model, Types } from 'mongoose';

export interface ICompany {
	name: string;
	title: string;
	about: string;
	website: string;
	location: string;
	teamMember: number;
	officeBranches: number;
	FoundedDate: string;
	jobs: Types.ObjectId[];
	creator: Types.ObjectId;
	logoImage: string;
	cloudinary_id: string;
}
