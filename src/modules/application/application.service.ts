import { JobModel } from "./../job/job.model";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { IApplication } from "./application.interface";
import { ApplicationModel } from "./application.model";
import { JwtPayload } from "jsonwebtoken";
import mongoose, { Types } from "mongoose";
import { userModel } from "@modules/acl/auth.model";


const applicationCreate = async (
  payload: IApplication,
  jobId: string,
  currentUser: JwtPayload
) => {
  console.log("service applic ", jobId);
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const allreadyApply = await ApplicationModel.findOne({
      job: jobId,
      applicant: currentUser.userId,
    }).session(session);

    if (allreadyApply) {
      throw new ApiError(400, "You have already applied for this job #");
    }

    // create application
    const newApplication = await new ApplicationModel({
      job: jobId,
      applicant: currentUser.userId,
    }).save({ session });

    // If failed to create an application
    if (!newApplication) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Failed to create application"
      );
    }

    // Update the JobModel's applications
    const JobModelUpdate = await JobModel.findByIdAndUpdate(
      jobId,
      { $push: { applications: newApplication._id } },
      { session }
    );

    // Update the Auth --> myAppliedJobs
    const AuthModelUpdate = await userModel.findByIdAndUpdate(
      currentUser.userId,
      { $push: { myAppliedJobs: jobId } },
      { session }
    );

    if (!JobModelUpdate) {
      throw new ApiError(500, "Failed to update Job.");
    }

    if (!JobModelUpdate) {
      throw new ApiError(500, "Failed to update Job.");
    }

    if (!AuthModelUpdate) {
      throw new ApiError(500, "Failed to update Auth --> myAppliedJobs.");
    }

    // Commit the transaction
    await session.commitTransaction();

    return {
      newApplication,
    };
  } catch (error: any) {
    await session.abortTransaction();
    throw new ApiError(
      400,
      error.message || "An error occurred while apply for job"
    );
  } finally {
    session.endSession();
  }
};

const acceptApplication = async (jobSeeker_id: any, jobId: string) => {
  if (!Types.ObjectId.isValid(jobSeeker_id)) {
    throw new ApiError(400, "Invalid JobSeeker ID");
  }

  if (!Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid Job ID");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1.Find the jobSeeker  if jobSeeker exits or not)
    const jobSeeker = await userModel.findById(jobSeeker_id).session(session);
    if (!jobSeeker) {
      throw new ApiError(400, "JobSeeker Not Found");
    }

    // 1.Find the job  if job exits or not)
    const job = await JobModel.findById(jobId).session(session);
    if (!job) {
      throw new ApiError(400, "Job Not Found");
    }
    // update application status pending to accepted)
    const updatedApplicationStatus = await ApplicationModel.findOneAndUpdate(
      {
        job: job._id,
        applicant: jobSeeker._id,
      },
      { status: "accepted" },
      { new: true, session }
    );

    if (!updatedApplicationStatus) {
      throw new ApiError(
        404,
        "Application not found for the specified job and applicant."
      );
    }

    // Commit the transaction
    await session.commitTransaction();

    return {
      updatedApplicationStatus,
    };
  } catch (error: any) {
    await session.abortTransaction();
    throw new ApiError(
      400,
      error.message || "An error occurred while accept application"
    );
  } finally {
    session.endSession();
  }
};

const rejectApplication = async (jobSeeker_id: any, jobId: string) => {
  if (!Types.ObjectId.isValid(jobSeeker_id)) {
    throw new ApiError(400, "Invalid Job ID");
  }

  if (!Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid Job ID");
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1.Find the jobSeeker  if jobSeeker exits or not)
    const jobSeeker = await userModel.findById(jobSeeker_id).session(session);
    if (!jobSeeker) {
      throw new ApiError(400, "JobSeeker Not Found");
    }

    // 2.get application by jobSeeker id  and jobId
    const application = await ApplicationModel.findOne({
      applicant: jobSeeker_id,
      job: jobId,
    });
    if (!application) {
      throw new Error("Application not found");
    }

    // Remove the application ID from the JobModel's applications array
    const JobModelUpdate = await JobModel.findByIdAndUpdate(
      jobId,
      { $pull: { applications: application._id } },
      { session }
    );

    if (!JobModelUpdate) {
      throw new ApiError(500, "Failed to update Job model applications.");
    }

    // delete this application after removie application id from jobModel
    await ApplicationModel.findByIdAndDelete(application._id).session(session);

    // Remove the Auth --> myAppliedJobs
    const AuthModelUpdate = await userModel.findByIdAndUpdate(
      jobSeeker_id,
      { $pull: { myAppliedJobs: jobId } },
      { session }
    );

    if (!AuthModelUpdate) {
      throw new ApiError(500, "Failed to update Auth --> myAppliedJobs.");
    }

    // Commit the transaction
    await session.commitTransaction();

    return {
      application,
    };
  } catch (error: any) {
    await session.abortTransaction();
    throw new ApiError(
      400,
      error.message || "An error occurred while apply for job"
    );
  } finally {
    session.endSession();
  }
};

const gettingAppliedJobsForUser = async (currentUser: JwtPayload) => {
  const application = await ApplicationModel.find({
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
    throw new ApiError(400, "You do not have any applied jobs");
  }
  return application;
};

const getApplicantsByJobId = async (jobId: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(jobId)) {
    throw new ApiError(400, "Invalid Job ID");
  }

  //Find the job (optional, if job exits or not)
  const job = await JobModel.findById(jobId);
  if (!job) {
    throw new ApiError(400, "Jobs Not Found");
  }

  //Find applications for that job and populate applicant data
  const applicants = await ApplicationModel.find({ job: jobId })
    .populate({
      path: "applicant",
      select: "name",
    })
    .lean();

  if (!applicants || applicants.length === 0) {
    throw new ApiError(404, "No applicants found for this job");
  }

  // return data;
  return {
    data: applicants,
  };
};

const alreadyAppliedJob = async (
  currentUser: JwtPayload,
  jobId: string | Types.ObjectId
) => {
  const application = await ApplicationModel.findOne({
    job: jobId,
    applicant: currentUser?.userId,
  });

  return { data: !!application };
};

export const ApplicationServices = {
  applicationCreate,
  gettingAppliedJobsForUser,
  acceptApplication,
  rejectApplication,
  getApplicantsByJobId,
  alreadyAppliedJob,
};
