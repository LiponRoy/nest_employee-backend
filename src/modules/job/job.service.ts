import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import {IPagination } from "./job.interface";
import { JobModel } from "./job.model";
import { JwtPayload } from "jsonwebtoken";
import mongoose, { SortOrder, Types } from "mongoose";
import { CompanyModel } from "../company/company.model";
import { allCategory, searchableFields } from "./job.constant";
import { paginetionHelpers } from "../../helper/paginationHelpers";
import { ApplicationModel } from "../application/application.model";
import { userModel } from "../acl/auth.model";
import { redisClient } from "@utils/redisClient";

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

export const allJob = async (filters: any, paginationFields: IPagination) => {
  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];

  // Generate unique cache key based on filters & pagination
  const CACHE_KEY = `${process.env.REDIS_CACHE_KEY_PREFIX || "cache"}:jobs:${JSON.stringify(filters)}:page:${paginationFields.page}:limit:${paginationFields.limit}`;
  const TTL = parseInt(process.env.REDIS_TTL || "60"); // default 60s
  const start = Date.now();

  // Try fetching from Redis
  const cachedData:any = await redisClient.get(CACHE_KEY);
  if (cachedData) {
    console.log("🚀 Cache HIT");
    console.log(`⏱ Redis fetch took: ${Date.now() - start}ms`);
    return JSON.parse(cachedData);
  }

  console.log("🐢 Cache MISS");

  // --- Searching by country/category ---
  if (typeof searchTerm === "string") {
    if (searchTerm === allCategory || searchTerm === "") {
      andConditions.push({});
    } else {
      andConditions.push({
        $or: searchableFields.map((field) => ({
          [field]: {
            $regex: searchTerm,
            $options: "i",
          },
        })),
      });
    }
  }

  // --- Filtering ---
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // --- Pagination ---
  const { page, limit, skip, sortBy, sortOrder } =
    paginetionHelpers.calculatePaginetion(paginationFields);

  // --- Sorting ---
  const sortConditions: Record<string, SortOrder> = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  // Fetch from DB
  const jobs = await JobModel.find(whereConditions)
    .populate("companyId")
    .lean()
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  if (!jobs || jobs.length === 0) {
    throw new ApiError(409, "Jobs not found.");
  }

  const total = await JobModel.countDocuments(whereConditions);

  const result = {
    meta: {
      page,
      limit,
      total,
    },
    data: jobs,
  };

  // Cache result
  await redisClient.setEx(CACHE_KEY, TTL, JSON.stringify(result));

  return result;
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

const deleteJobById = async (jobId: string) => {
    if (!Types.ObjectId.isValid(jobId)) {
        throw new ApiError(400, "Invalid Job ID");
    }

    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        // 1.Find the job  if job exits or not)
        const job = await JobModel.findById(jobId).session(session);
        if (!job) {
            throw new ApiError(400, "Jobs Not Found");
        }

        // 2. Delete all applications from application model related to this job id
        const appDeleteResult = await ApplicationModel.deleteMany({
            job: jobId,
        }).session(session);

        // 3. Pull jobId from all users' appliedJobs field
        const userUpdateResult = await userModel.updateMany(
            { myAppliedJobs: jobId },
            { $pull: { myAppliedJobs: jobId } },
            { session }
        );

        // 4. Finally Delete the Job
        const jobDeleteResult = await JobModel.deleteOne({
            _id: jobId,
        }).session(session);

        // Commit the transaction
        await session.commitTransaction();

        return {
            jobDeleteResult,
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

export const JobServices = {
    jobCreate,
    allJob,
    getJobByCreator,
    getJobById,
    deleteJobById,
};
