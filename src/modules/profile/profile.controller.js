"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsyncErrors_1 = require("../../utils/catchAsyncErrors");
const profile_services_1 = require("./profile.services");
const getProfileDataById = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const result = await profile_services_1.profileServices.getProfileDataById(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Pofile get Successfully !',
        data: result,
    });
});
const getGeneralInfoData = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const result = await profile_services_1.profileServices.getGeneralInfoData(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'get General Info Data get Successfully !',
        data: result,
    });
});
const getEducationData = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const result = await profile_services_1.profileServices.getEducationData(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Education data get Successfully !',
        data: result,
    });
});
const generalInfoUpdate = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const { ...profileInfo } = req.body;
    const profileData = await profile_services_1.profileServices.generalInfoUpdate(profileInfo, req.user, req.file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'profile general info Update Successfully',
        data: profileData,
    });
});
const updateSkills = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const { skills } = req.body;
    const profileSkills = await profile_services_1.profileServices.updateSkills(skills, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Skills updated successfully',
        data: profileSkills?.skills,
    });
});
const updateEducation = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const educationData = req.body;
    const result = await profile_services_1.profileServices.updateEducation(educationData, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Education updated successfully',
        data: result.education,
    });
});
const updateExperience = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const experienceData = req.body;
    const result = await profile_services_1.profileServices.updateExperience(experienceData, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Experience updated successfully',
        data: result.experience,
    });
});
exports.profileControllers = {
    getProfileDataById,
    getEducationData,
    getGeneralInfoData,
    generalInfoUpdate,
    updateSkills,
    updateEducation,
    updateExperience,
};
