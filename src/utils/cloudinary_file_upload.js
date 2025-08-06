"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLocalFile = exports.deleteImage = exports.uploadImage = void 0;
const ApiError_1 = __importDefault(require("../errors/ApiError"));
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = __importDefault(require("./cloudinary"));
const uploadImage = async (filePath, folder) => {
    try {
        const result = await cloudinary_1.default.uploader.upload(filePath, {
            folder,
            transformation: [
                { width: 800, height: 800, crop: 'limit' },
                { quality: 'auto', fetch_format: 'auto' },
            ],
        });
        return result;
    }
    catch (error) {
        throw new ApiError_1.default(500, 'Failed to upload image to Cloudinary');
    }
};
exports.uploadImage = uploadImage;
const deleteImage = async (cloudinaryId) => {
    try {
        await cloudinary_1.default.uploader.destroy(cloudinaryId);
    }
    catch (error) {
        throw new ApiError_1.default(500, 'Failed to delete image from Cloudinary');
    }
};
exports.deleteImage = deleteImage;
const deleteLocalFile = (filePath) => {
    try {
        fs_1.default.unlinkSync(filePath);
    }
    catch (error) {
        throw new ApiError_1.default(500, 'Failed to delete local file');
    }
};
exports.deleteLocalFile = deleteLocalFile;
