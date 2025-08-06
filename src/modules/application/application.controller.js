"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsyncErrors_1 = require("../../utils/catchAsyncErrors");
const application_service_1 = require("./application.service");
const applicationCreate = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const { ...applicationInfo } = req.body;
    const { jobId } = req.params;
    const applicationData = await application_service_1.ApplicationServices.applicationCreate(applicationInfo, jobId, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "application Create Successfully",
        data: applicationData,
    });
});
const acceptApplication = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const { jobSeeker_id, jobId } = req.params;
    // const { jobId } = req.body;
    const applicationData = await application_service_1.ApplicationServices.acceptApplication(jobSeeker_id, jobId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "application accepted Successfully",
        data: applicationData,
    });
});
const rejectApplication = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const { jobSeeker_id, jobId } = req.params;
    // const { jobId } = req.body;
    const applicationData = await application_service_1.ApplicationServices.rejectApplication(jobSeeker_id, jobId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "application Rejected Successfully",
        data: applicationData,
    });
});
const gettingAppliedJobsForUser = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    // console.log("ggg", req.user);
    const applicationData = await application_service_1.ApplicationServices.gettingAppliedJobsForUser(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "jobs getting Successfully",
        data: applicationData,
    });
});
const alreadyAppliedJob = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const { jobId } = req.params;
    console.log("controllerxxx : ", req.user);
    const applicationData = await application_service_1.ApplicationServices.alreadyAppliedJob(req.user, jobId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "already pplied job Successfully",
        data: applicationData,
    });
});
const getApplicantsByJobId = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const { jobId } = req.params;
    const applicants = await application_service_1.ApplicationServices.getApplicantsByJobId(jobId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "applicants getting Successfully",
        data: applicants,
    });
});
exports.applicationControllers = {
    applicationCreate,
    gettingAppliedJobsForUser,
    acceptApplication,
    rejectApplication,
    getApplicantsByJobId,
    alreadyAppliedJob,
};
