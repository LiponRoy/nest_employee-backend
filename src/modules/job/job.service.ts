import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { IJob } from "./job.interface";
import { JobModel } from "./job.model";
import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import { CompanyModel } from "../company/company.model";
import cloudinary from "../../utils/cloudinary";
import { searchableFields } from "./job.constant";

const jobCreate = async (payload: any) => {
  const { title, created_by, companyName } = payload;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // Check if job exists
    const job = await JobModel.findOne({ title }).session(session);

    if (job) {
      throw new ApiError(409, "This job already exists");
    }

    // getting company _id by company name
    const companyData = await CompanyModel.findOne({
      name: companyName,
    }).session(session);

    if (!companyData) {
      throw new ApiError(409, "company Data not found");
    }

    // create job
    const newJob = new JobModel({
      ...payload,
      companyId: companyData?._id.toString(),
      created_by: created_by,
    });

    await newJob.save({ session });

    // If failed to create an job
    if (!newJob) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create job");
    }

    // Commit the transaction
    await session.commitTransaction();

    return {
      newJob,
    };
  } catch (error: any) {
    // Roleback the transaction in case of an error
    await session.abortTransaction();
    throw new ApiError(400, error);
  } finally {
    // Ensure the session is always ended
    session.endSession();
  }
};

const allJob = async (filters: any) => {
  const { searchTerm } = filters;

  const andConditions = [];
  // for searching based on category
if (typeof searchTerm === 'string') {
    andConditions.push({
      $or: searchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};


  const jobs = await JobModel.find(whereConditions).populate("companyId").lean();

  if (!jobs) {
    throw new ApiError(409, "jobs not found .");
  }

  const total = await JobModel.countDocuments(whereConditions);

  // return jobs;
  return {
    meta: {
      total,
    },
    data: jobs,
  };
};

const getJobByCreator = async (currentUser: JwtPayload) => {
  console.log("job cus:", currentUser);
  const loginUser = currentUser?.userId;
  const Job = await JobModel.find({ created_by: loginUser });

  if (!Job) {
    throw new ApiError(409, "Job not found");
  }
  return Job;
};

const getJobById = async (id: string) => {
  const job = await JobModel.findById(id).populate("companyId").lean();

  if (!job) {
    throw new ApiError(409, "Job not found");
  }

  return job;
};

export const JobServices = {
  jobCreate,
  allJob,
  getJobByCreator,
  getJobById,
};
