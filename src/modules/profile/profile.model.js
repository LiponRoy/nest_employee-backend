"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileModel = void 0;
const mongoose_1 = require("mongoose");
const profileSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    generalInfo: {
        phone: { type: String },
        gender: { type: String },
        age: { type: Number },
        bio: { type: String },
        address: { type: String },
        about: { type: String },
        // pdf cv upload
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
}, {
    timestamps: true,
});
exports.profileModel = (0, mongoose_1.model)('Profile', profileSchema);
