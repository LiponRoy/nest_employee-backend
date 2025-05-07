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
	category: string;
	// position: number;
	datePosted: string;
	dateDeadline: string;
	vacancy: number;
	educationQualification: string;
	gender: string;
	companyId: Types.ObjectId;
	created_by: Types.ObjectId;
	applications: Types.ObjectId[];
	logoImage: string;
	cloudinary_id: string;
}

export interface IPagination {
	page?: number;
	limit?: number;
	shortBy?: string;
	shortOrder?: string;
}
