import { Schema, model, models, Document, Model } from 'mongoose';
import { IProfile } from './profile.interface';

// Extend IProfile with Document
type ProfileDocument = IProfile & Document;

const profileSchema = new Schema<ProfileDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    generalInfo: {
      phone: { type: String },
      gender: { type: String },
      age: { type: Number },
      bio: { type: String },
      address: { type: String },
      about: { type: String },
      pdf_cloudinary_id: { type: String },
      pdf_cloudinary_url: { type: String },
    },

    skills: { type: [String] },

    education: [
      {
        instituteName: { type: String },
        degree: { type: String },
        cgpa: { type: String },
        passingYear: { type: String },
      },
    ],

    experience: [
      {
        organizationName: { type: String },
        yearsOfExperience: { type: Number },
        position: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ✅ Export as correctly typed Model
export const profileModel: Model<ProfileDocument> =
  models.Profile || model<ProfileDocument>('Profile', profileSchema);
