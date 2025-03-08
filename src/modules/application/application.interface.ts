import { Model, Types } from 'mongoose';

export interface IApplication {
	job: Types.ObjectId;
	applicant: Types.ObjectId;
	status: string;
}
