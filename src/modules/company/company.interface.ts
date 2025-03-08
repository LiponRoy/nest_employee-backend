import { Model, Types } from 'mongoose';

export interface ICompany {
	name: string;
	description: string;
	website: string;
	location: string;
	creator: Types.ObjectId;
}
