"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const profile_model_1 = require("../profile/profile.model");
const mongoose_1 = __importDefault(require("mongoose"));
const auth_model_1 = require("./auth.model");
const signupUser = async (payload) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction(); // Start the transaction
    try {
        const { email } = payload;
        // Check if user exists
        const user = await auth_model_1.userModel.isUserExistsByEmail(email);
        if (user) {
            throw new ApiError_1.default(409, 'User already exists');
        }
        // create user
        const newUser = new auth_model_1.userModel({
            ...payload,
        });
        await newUser.save({ session });
        // Create empty profile with only userId
        const newProfile = new profile_model_1.profileModel({ userId: newUser._id });
        await newProfile.save({ session });
        // If failed to create an user
        if (!newUser) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create user');
        }
        // Commit transaction
        await session.commitTransaction();
        return {
            newUser,
        };
    }
    catch (error) {
        // Rollback the transaction in case of an error
        await session.abortTransaction();
        throw new ApiError_1.default(400, error.message || 'An error occurred while creating the product.');
    }
    finally {
        // Ensure the session is always ended
        session.endSession();
    }
};
const loginUser = async (payload) => {
    // checking if the user is exist
    const user = await auth_model_1.userModel.isUserExistsByEmail(payload.email);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
    }
    //checking if the password is correct
    if (!(await auth_model_1.userModel.isPasswordMatched(payload?.password, user?.password)))
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Password do not matched');
    // Generate JWT token
    const authToken = jsonwebtoken_1.default.sign({ userId: user._id, userRole: user.role }, config_1.default.jwt_auth_secret, { expiresIn: '1h' });
    return {
        authToken,
        user,
    };
};
const profile = async (userId) => {
    const result = await auth_model_1.userModel.findOne({ _id: userId });
    return result;
};
exports.AuthServices = {
    signupUser,
    loginUser,
    profile,
};
