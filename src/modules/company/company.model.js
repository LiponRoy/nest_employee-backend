"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyModel = void 0;
const mongoose_1 = require("mongoose");
const companySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    about: { type: String, required: true },
    // website: { type: String, required: true },
    location: { type: String, required: true },
    teamMember: { type: Number, required: true },
    officeBranches: { type: Number, required: true },
    FoundedDate: { type: String, required: true },
    jobs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Job' }],
    creator: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    logoImage: {
        type: String,
    },
    cloudinary_id: {
        type: String,
    },
}, {
    timestamps: true,
});
exports.CompanyModel = (0, mongoose_1.model)('Company', companySchema);
