"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const job_model_1 = require("./job.model");
const mongoose_1 = __importStar(require("mongoose"));
const company_model_1 = require("../company/company.model");
const job_constant_1 = require("./job.constant");
const paginationHelpers_1 = require("../../helper/paginationHelpers");
const application_model_1 = require("../application/application.model");
const auth_model_1 = require("@modules/auth/auth.model");
const jobCreate = async (payload) => {
    const { title, created_by, companyName } = payload;
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // Check if job exists
        const job = await job_model_1.JobModel.findOne({ title }).session(session);
        if (job) {
            throw new ApiError_1.default(409, "This job already exists");
        }
        // getting company _id by company name
        const companyData = await company_model_1.CompanyModel.findOne({
            name: companyName,
        }).session(session);
        if (!companyData) {
            throw new ApiError_1.default(409, "company Data not found");
        }
        // create job
        const newJob = new job_model_1.JobModel({
            ...payload,
            companyId: companyData?._id.toString(),
            created_by: created_by,
        });
        await newJob.save({ session });
        // If failed to create an job
        if (!newJob) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create job");
        }
        // Commit the transaction
        await session.commitTransaction();
        return {
            newJob,
        };
    }
    catch (error) {
        // Roleback the transaction in case of an error
        await session.abortTransaction();
        throw new ApiError_1.default(400, error);
    }
    finally {
        // Ensure the session is always ended
        session.endSession();
    }
};
const allJob = async (filters, paginationFields) => {
    const { searchTerm, ...filtersData } = filters;
    const andConditions = [];
    // for searching based on category
    if (typeof searchTerm === "string") {
        andConditions.push({
            $or: job_constant_1.searchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    // for filtering
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    // for pagination
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.paginetionHelpers.calculatePaginetion(paginationFields);
    // End for pagination
    // for sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    // End for sorting
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const jobs = await job_model_1.JobModel.find(whereConditions)
        .populate("companyId")
        .lean()
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    if (!jobs) {
        throw new ApiError_1.default(409, "jobs not found .");
    }
    const total = await job_model_1.JobModel.countDocuments(whereConditions);
    // return jobs;
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: jobs,
    };
};
const getJobByCreator = async (currentUser) => {
    console.log("job cus:", currentUser);
    const loginUser = currentUser?.userId;
    const Job = await job_model_1.JobModel.find({ created_by: loginUser });
    if (!Job) {
        throw new ApiError_1.default(409, "Job not found");
    }
    return Job;
};
const getJobById = async (id) => {
    const job = await job_model_1.JobModel.findById(id).populate("companyId").lean();
    if (!job) {
        throw new ApiError_1.default(409, "Job not found");
    }
    return job;
};
const deleteJobById = async (jobId) => {
    if (!mongoose_1.Types.ObjectId.isValid(jobId)) {
        throw new ApiError_1.default(400, "Invalid Job ID");
    }
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // 1.Find the job  if job exits or not)
        const job = await job_model_1.JobModel.findById(jobId).session(session);
        if (!job) {
            throw new ApiError_1.default(400, "Jobs Not Found");
        }
        // 2. Delete all applications from application model related to this job id
        const appDeleteResult = await application_model_1.ApplicationModel.deleteMany({
            job: jobId,
        }).session(session);
        // 3. Pull jobId from all users' appliedJobs field
        const userUpdateResult = await auth_model_1.userModel.updateMany({ myAppliedJobs: jobId }, { $pull: { myAppliedJobs: jobId } }, { session });
        // 4. Finally Delete the Job
        const jobDeleteResult = await job_model_1.JobModel.deleteOne({
            _id: jobId,
        }).session(session);
        // Commit the transaction
        await session.commitTransaction();
        return {
            jobDeleteResult,
        };
    }
    catch (error) {
        // Roleback the transaction in case of an error
        await session.abortTransaction();
        throw new ApiError_1.default(400, error);
    }
    finally {
        // Ensure the session is always ended
        session.endSession();
    }
};
exports.JobServices = {
    jobCreate,
    allJob,
    getJobByCreator,
    getJobById,
    deleteJobById,
};
