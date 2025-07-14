import { Types } from "mongoose";

export interface IgeneralInfo {
  phone: string;
  gender: string;
  age: number;
  bio: string;
  address: string;
  about: string;

  pdf_cloudinary_id?: string;
  pdf_cloudinary_url?: string;
}
export interface IEducation {
  instituteName: string;
  degree: string;
  cgpa: string;
  passingYear: string;
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
