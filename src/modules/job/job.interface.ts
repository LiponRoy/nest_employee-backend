import { Model, Types } from 'mongoose';

export interface IJob {
	title: string;
	description: string;
	requirements: string[];
	responsibility: string[];
	salaryAndBenefits: string[];
	skillAndExperience: string[];
	minSalary: number;
	maxSalary: number;
	experienceLevel: number;
	location: string;
	jobType: string;
	position: number;
	datePosted: string;
	dateDeadline: string;
	vacancy: number;
	educationQualification: string;
	gender: string;
	company: Types.ObjectId;
	created_by: Types.ObjectId;
	applications: Types.ObjectId[];
}
