import { Model, Types } from 'mongoose';

export interface IJob {
	title: string;
	description: string;
	requirements: string[];
	salary: number;
	experienceLevel: number;
	location: string;
	jobType: string;
	position: number;
	company: Types.ObjectId;
	created_by: Types.ObjectId;
	applications: Types.ObjectId[];
}
