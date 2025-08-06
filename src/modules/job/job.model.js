"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = void 0;
const mongoose_1 = require("mongoose");
const jobSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ title: String }],
    responsibility: [{ title: String }],
    salaryAndBenefits: [{ title: String }],
    skillAndExperience: [{ title: String }],
    minSalary: { type: Number, required: true },
    maxSalary: { type: Number, required: true },
    experienceLevel: { type: Number, required: true },
    location: { type: String, required: true },
    division: { type: String, required: true },
    jobType: { type: String, required: true },
    category: { type: String, required: true },
    // position: { type: Number, required: true },
    datePosted: { type: String, required: true },
    dateDeadline: { type: String, required: true },
    vacancy: { type: Number, required: true },
    educationQualification: { type: String, required: true },
    gender: { type: String, required: true },
    companyId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Company', required: true },
    created_by: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    applications: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Application' }],
}, {
    timestamps: true,
});
exports.JobModel = (0, mongoose_1.model)('Job', jobSchema);
