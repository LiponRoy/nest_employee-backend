"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsyncErrors_1 = require("../../utils/catchAsyncErrors");
const job_service_1 = require("./job.service");
const queryFilter_1 = __importDefault(require("../../utils/queryFilter"));
const job_constant_1 = require("./job.constant");
const jobCreate = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const { ...jobInfo } = req.body;
    const jobData = await job_service_1.JobServices.jobCreate(jobInfo);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'job Create Successfully',
        data: jobData,
    });
});
const allJob = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const paginationOptions = (0, queryFilter_1.default)(req.query, job_constant_1.paginationsFields);
    const filters = (0, queryFilter_1.default)(req.query, job_constant_1.filterableFields);
    const result = await job_service_1.JobServices.allJob(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Jobs get Successfully !',
        meta: result.meta,
        data: result.data,
    });
});
const getJobByCreator = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const jobData = await job_service_1.JobServices.getJobByCreator(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'job Getting Successfully',
        data: jobData,
    });
});
const getJobById = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const jobData = await job_service_1.JobServices.getJobById(req.params.id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'job Getting Successfully',
        data: jobData,
    });
});
const deleteJobById = (0, catchAsyncErrors_1.catchAsyncError)(async (req, res) => {
    const { jobId } = req.params;
    const jobData = await job_service_1.JobServices.deleteJobById(jobId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'delete Job Successfully',
        data: jobData,
    });
});
exports.JobControllers = {
    jobCreate,
    allJob,
    getJobByCreator,
    getJobById,
    deleteJobById
};
