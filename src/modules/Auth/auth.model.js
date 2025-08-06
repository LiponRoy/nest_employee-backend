"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const user_1 = require("../../enums/user");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        select: 0,
    },
    role: {
        type: String,
        // JobSeeker,who can apply for job and update his profile
        // Employer, who can create company and create job post
        enum: [user_1.UserRole.JOB_SEEKER, user_1.UserRole.EMPLOYER, user_1.UserRole.ADMIN],
        default: user_1.UserRole.JOB_SEEKER,
    },
    myAppliedJobs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Job' }],
}, {
    timestamps: true,
});
userSchema.pre('save', async function (next) {
    const user = this; // doc
    // hashing password and save into DB
    user.password = await bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
    next();
});
// Define the static method for isUserExistsByEmail
userSchema.statics.isUserExistsByEmail = async function (email) {
    return await exports.userModel.findOne({ email }).select('+password');
};
userSchema.statics.isPasswordMatched = async function (plainTextPassword, hashedPassword) {
    return await bcrypt_1.default.compare(plainTextPassword, hashedPassword);
};
exports.userModel = (0, mongoose_1.model)('User', userSchema);
