import { Types } from 'mongoose';

export interface IgeneralInfo {
	phone: string;
	gender: string;
	age: number;
	bio: string;
	address: string;
	about: string;
}
export interface IEducation {
	instituteName: string;
	degree: string;
	cgpa: string;
	passingYear: number;
}

export interface IExperience {
	organizationName: string;
	yearsOfExperience: number;
	position: string;
}

export interface IProfile {
	userId: Types.ObjectId;
	generalInfo: IgeneralInfo;
	skills: string[];
	education: IEducation[];
	experience: IExperience[];
}
