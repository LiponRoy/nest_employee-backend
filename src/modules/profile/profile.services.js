"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileServices = void 0;
const profile_model_1 = require("./profile.model");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const getProfileDataById = async (currentUser) => {
    const loginUser = currentUser?.userId;
    if (!mongoose_1.default.Types.ObjectId.isValid(loginUser)) {
        throw new ApiError_1.default(400, "Invalid user ID format");
    }
    const profileData = await profile_model_1.profileModel
        .findOne({ userId: loginUser })
        .populate("userId", "name role")
        .lean();
    if (!profileData) {
        throw new ApiError_1.default(400, "Failed to get profile data");
    }
    return profileData;
};
const getEducationData = async (currentUser) => {
    const loginUser = currentUser?.userId;
    if (!mongoose_1.default.Types.ObjectId.isValid(loginUser)) {
        throw new ApiError_1.default(400, "Invalid user ID format");
    }
    // const profileData = await profileModel.education.find({ userId: loginUser }).populate("userId","name role").lean();
    const educations = await profile_model_1.profileModel.findOne({ userId: loginUser }, { education: 1, _id: 0 });
    if (!educations) {
        throw new ApiError_1.default(400, "Failed to get profile data");
    }
    return educations;
};
const getGeneralInfoData = async (currentUser) => {
    const loginUser = currentUser?.userId;
    if (!mongoose_1.default.Types.ObjectId.isValid(loginUser)) {
        throw new ApiError_1.default(400, "Invalid user ID format");
    }
    const educations = await profile_model_1.profileModel.findOne({ userId: loginUser }, { generalInfo: 1, _id: 0 });
    if (!educations) {
        throw new ApiError_1.default(400, "Failed to get profile data");
    }
    return educations;
};
const generalInfoUpdate = async (payload, currentUser, photoFile) => {
    const { phone, gender, age, bio, address, about } = payload;
    const loginUser = currentUser.userId;
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const checkProfile = await profile_model_1.profileModel
            .findOne({ userId: loginUser })
            .session(session);
        // If user not found
        if (!checkProfile) {
            throw new ApiError_1.default(400, "User not found");
        }
        // Prepare for Cloudinary upload
        let result = null;
        if (photoFile) {
            try {
                // Upload image to Cloudinary
                result = await cloudinary_1.default.uploader.upload(photoFile.path, {
                    folder: "nest-emp-profile-img",
                    transformation: [
                        { width: 800, height: 800, crop: "limit" }, // Resize image
                        { quality: "auto", fetch_format: "auto" }, // Optimize quality and format
                    ],
                });
            }
            catch (cloudinaryError) {
                throw new ApiError_1.default(500, "Failed to upload image to Cloudinary");
            }
        }
        // End Prepare for Cloudinary upload
        const updatedProfile = await profile_model_1.profileModel.findOneAndUpdate({ userId: loginUser }, {
            $set: {
                generalInfo: {
                    phone,
                    gender,
                    age,
                    bio,
                    address,
                    about,
                    // new for file
                    pdf_cloudinary_url: result?.secure_url,
                    pdf_cloudinary_id: result?.public_id,
                },
            },
        }, { new: true, session });
        // If failed to update profile
        if (!updatedProfile) {
            throw new ApiError_1.default(400, "Failed to Update Profile");
        }
        // Commit the transaction
        await session.commitTransaction();
        return updatedProfile;
    }
    catch (error) {
        // Rollback the transaction in case of an error
        await session.abortTransaction();
        console.log(error);
        throw new ApiError_1.default(400, error.message || "An error occurred while creating the company.");
    }
    finally {
        // Ensure the session is always ended
        session.endSession();
    }
};
const updateSkills = async (skills, currentUser) => {
    const loginUser = currentUser.userId;
    const updatedProfile = await profile_model_1.profileModel.findOneAndUpdate({ userId: loginUser }, {
        $set: {
            skills,
        },
    }, { new: true });
    if (!updatedProfile) {
        throw new ApiError_1.default(400, "Failed to Update Skills");
    }
    return updatedProfile;
};
const updateEducation = async (payload, currentUser) => {
    const loginUser = currentUser.userId;
    const updatedProfile = await profile_model_1.profileModel.findOneAndUpdate({ userId: loginUser }, { $set: { education: payload.education } }, { new: true });
    if (!updatedProfile) {
        throw new ApiError_1.default(400, "Failed to Update Education");
    }
    return updatedProfile;
};
const updateExperience = async (payload, currentUser) => {
    const loginUser = currentUser.userId;
    const updatedProfile = await profile_model_1.profileModel.findOneAndUpdate({ userId: loginUser }, { $set: { experience: payload.experience } }, { new: true });
    if (!updatedProfile) {
        throw new ApiError_1.default(400, "Failed to Update Experience");
    }
    return updatedProfile;
};
exports.profileServices = {
    getProfileDataById,
    getEducationData,
    getGeneralInfoData,
    generalInfoUpdate,
    updateSkills,
    updateEducation,
    updateExperience,
};
