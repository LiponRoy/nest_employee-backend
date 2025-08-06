"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const company_model_1 = require("./company.model");
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const companyCreate = async (payload, photoFile) => {
    const { name, creator } = payload;
    console.log('pp creator', creator);
    console.log('pp payload', payload);
    console.log('pp photoFile', photoFile);
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Check if company exists
        const company = await company_model_1.CompanyModel.findOne({ name }).session(session);
        if (company) {
            throw new ApiError_1.default(409, 'company already exists');
        }
        // Prepare for Cloudinary upload
        let result = null;
        if (photoFile) {
            try {
                // Upload image to Cloudinary
                result = await cloudinary_1.default.uploader.upload(photoFile.path, {
                    folder: 'nest-emp-company-img',
                    transformation: [
                        { width: 800, height: 800, crop: 'limit' }, // Resize image
                        { quality: 'auto', fetch_format: 'auto' }, // Optimize quality and format
                    ],
                });
            }
            catch (cloudinaryError) {
                throw new ApiError_1.default(500, 'Failed to upload image to Cloudinary');
            }
        }
        // Create the new product
        const newCompany = new company_model_1.CompanyModel({
            ...payload,
            creator: creator,
            logoImage: result?.secure_url,
            cloudinary_id: result?.public_id,
        });
        // Save the product and add it to the user's product list in a single atomic operation
        await newCompany.save({ session });
        // If failed to create an company
        if (!newCompany) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create Company');
        }
        // Commit the transaction
        await session.commitTransaction();
        return {
            newCompany,
        };
    }
    catch (error) {
        // Rollback the transaction in case of an error
        await session.abortTransaction();
        console.log(error);
        throw new ApiError_1.default(400, error.message || 'An error occurred while creating the company.');
    }
    finally {
        // Ensure the session is always ended
        session.endSession();
    }
};
const getCompanyByCreator = async (currentUser) => {
    const loginUser = currentUser.userId;
    const company = await company_model_1.CompanyModel.find({ creator: loginUser });
    if (!company) {
        throw new ApiError_1.default(409, 'company not found');
    }
    return company;
};
const gettingCompnyNamesByCreator = async (currentUser) => {
    const loginUser = currentUser.userId;
    console.log('loginUser', loginUser);
    const companyNames = await company_model_1.CompanyModel.distinct('name', {
        creator: loginUser,
    });
    if (!companyNames) {
        throw new ApiError_1.default(409, 'companyNames not found');
    }
    return companyNames;
};
exports.CompanyServices = {
    companyCreate,
    getCompanyByCreator,
    gettingCompnyNamesByCreator,
};
