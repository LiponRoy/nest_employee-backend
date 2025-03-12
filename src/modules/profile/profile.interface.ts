import { Model, Types } from 'mongoose';

export interface IProfile {
	name: string;
	email: string;
	phone: string;
	bio: string;
	address: string;
	about: string;
	skills: string[];
	education: string[];
	experience: string[];
	user: Types.ObjectId;
}
