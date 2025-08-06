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
exports.ApplicationServices = void 0;
const job_model_1 = require("./../job/job.model");
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const application_model_1 = require("./application.model");
const mongoose_1 = __importStar(require("mongoose"));
const auth_model_1 = require("@modules/auth/auth.model");
const applicationCreate = async (payload, jobId, currentUser) => {
    console.log("service applic ", jobId);
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const allreadyApply = await application_model_1.ApplicationModel.findOne({
            job: jobId,
            applicant: currentUser.userId,
        }).session(session);
        if (allreadyApply) {
            throw new ApiError_1.default(400, "You have already applied for this job #");
        }
        // create application
        const newApplication = await new application_model_1.ApplicationModel({
            job: jobId,
            applicant: currentUser.userId,
        }).save({ session });
        // If failed to create an application
        if (!newApplication) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Failed to create application");
        }
        // Update the JobModel's applications
        const JobModelUpdate = await job_model_1.JobModel.findByIdAndUpdate(jobId, { $push: { applications: newApplication._id } }, { session });
        // Update the Auth --> myAppliedJobs
        const AuthModelUpdate = await auth_model_1.userModel.findByIdAndUpdate(currentUser.userId, { $push: { myAppliedJobs: jobId } }, { session });
        if (!JobModelUpdate) {
            throw new ApiError_1.default(500, "Failed to update Job.");
        }
        if (!JobModelUpdate) {
            throw new ApiError_1.default(500, "Failed to update Job.");
        }
        if (!AuthModelUpdate) {
            throw new ApiError_1.default(500, "Failed to update Auth --> myAppliedJobs.");
        }
        // Commit the transaction
        await session.commitTransaction();
        return {
            newApplication,
        };
    }
    catch (error) {
        await session.abortTransaction();
        throw new ApiError_1.default(400, error.message || "An error occurred while apply for job");
    }
    finally {
        session.endSession();
    }
};
const acceptApplication = async (jobSeeker_id, jobId) => {
    if (!mongoose_1.Types.ObjectId.isValid(jobSeeker_id)) {
        throw new ApiError_1.default(400, "Invalid JobSeeker ID");
    }
    if (!mongoose_1.Types.ObjectId.isValid(jobId)) {
        throw new ApiError_1.default(400, "Invalid Job ID");
    }
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // 1.Find the jobSeeker  if jobSeeker exits or not)
        const jobSeeker = await auth_model_1.userModel.findById(jobSeeker_id).session(session);
        if (!jobSeeker) {
            throw new ApiError_1.default(400, "JobSeeker Not Found");
        }
        // 1.Find the job  if job exits or not)
        const job = await job_model_1.JobModel.findById(jobId).session(session);
        if (!job) {
            throw new ApiError_1.default(400, "Job Not Found");
        }
        // update application status pending to accepted)
        const updatedApplicationStatus = await application_model_1.ApplicationModel.findOneAndUpdate({
            job: job._id,
            applicant: jobSeeker._id,
        }, { status: "accepted" }, { new: true, session });
        if (!updatedApplicationStatus) {
            throw new ApiError_1.default(404, "Application not found for the specified job and applicant.");
        }
        // Commit the transaction
        await session.commitTransaction();
        return {
            updatedApplicationStatus,
        };
    }
    catch (error) {
        await session.abortTransaction();
        throw new ApiError_1.default(400, error.message || "An error occurred while accept application");
    }
    finally {
        session.endSession();
    }
};
const rejectApplication = async (jobSeeker_id, jobId) => {
    if (!mongoose_1.Types.ObjectId.isValid(jobSeeker_id)) {
        throw new ApiError_1.default(400, "Invalid Job ID");
    }
    if (!mongoose_1.Types.ObjectId.isValid(jobId)) {
        throw new ApiError_1.default(400, "Invalid Job ID");
    }
    const session = await mongoose_1.default.startSession();
    try {
        session.startTransaction();
        // 1.Find the jobSeeker  if jobSeeker exits or not)
        const jobSeeker = await auth_model_1.userModel.findById(jobSeeker_id).session(session);
        if (!jobSeeker) {
            throw new ApiError_1.default(400, "JobSeeker Not Found");
        }
        // 2.get application by jobSeeker id  and jobId
        const application = await application_model_1.ApplicationModel.findOne({
            applicant: jobSeeker_id,
            job: jobId,
        });
        if (!application) {
            throw new Error("Application not found");
        }
        // Remove the application ID from the JobModel's applications array
        const JobModelUpdate = await job_model_1.JobModel.findByIdAndUpdate(jobId, { $pull: { applications: application._id } }, { session });
        if (!JobModelUpdate) {
            throw new ApiError_1.default(500, "Failed to update Job model applications.");
        }
        // delete this application after removie application id from jobModel
        await application_model_1.ApplicationModel.findByIdAndDelete(application._id).session(session);
        // Remove the Auth --> myAppliedJobs
        const AuthModelUpdate = await auth_model_1.userModel.findByIdAndUpdate(jobSeeker_id, { $pull: { myAppliedJobs: jobId } }, { session });
        if (!AuthModelUpdate) {
            throw new ApiError_1.default(500, "Failed to update Auth --> myAppliedJobs.");
        }
        // Commit the transaction
        await session.commitTransaction();
        return {
            application,
        };
    }
    catch (error) {
        await session.abortTransaction();
        throw new ApiError_1.default(400, error.message || "An error occurred while apply for job");
    }
    finally {
        session.endSession();
    }
};
const gettingAppliedJobsForUser = async (currentUser) => {
    const application = await application_model_1.ApplicationModel.find({
        applicant: currentUser?.userId,
    })
        .populate({
        path: "job",
        select: "title description", // add multiple fields separated by space
    })
        .populate({
        path: "status",
        // select: 'title description', // add multiple fields separated by space
    });
    if (!application || application.length === 0) {
        throw new ApiError_1.default(400, "You do not have any applied jobs");
    }
    return application;
};
const getApplicantsByJobId = async (jobId) => {
    if (!mongoose_1.Types.ObjectId.isValid(jobId)) {
        throw new ApiError_1.default(400, "Invalid Job ID");
    }
    //Find the job (optional, if job exits or not)
    const job = await job_model_1.JobModel.findById(jobId);
    if (!job) {
        throw new ApiError_1.default(400, "Jobs Not Found");
    }
    //Find applications for that job and populate applicant data
    const applicants = await application_model_1.ApplicationModel.find({ job: jobId })
        .populate({
        path: "applicant",
        select: "name",
    })
        .lean();
    if (!applicants || applicants.length === 0) {
        throw new ApiError_1.default(404, "No applicants found for this job");
    }
    // return data;
    return {
        data: applicants,
    };
};
const alreadyAppliedJob = async (currentUser, jobId) => {
    const application = await application_model_1.ApplicationModel.findOne({
        job: jobId,
        applicant: currentUser?.userId,
    });
    return { data: !!application };
};
exports.ApplicationServices = {
    applicationCreate,
    gettingAppliedJobsForUser,
    acceptApplication,
    rejectApplication,
    getApplicantsByJobId,
    alreadyAppliedJob,
};
