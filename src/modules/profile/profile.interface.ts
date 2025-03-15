import { Model, Types } from 'mongoose';

export interface IProfile {
	userId: Types.ObjectId;
	phone: string;
	bio: string;
	address: string;
	about: string;
	skills: string[];
	education: string[];
	experience: string[];
}
