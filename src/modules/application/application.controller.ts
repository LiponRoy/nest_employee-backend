import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { catchAsyncError } from "../../utils/catchAsyncErrors";
import { Request, Response } from "express";
import { ApplicationServices } from "./application.service";

const applicationCreate = catchAsyncError(
  async (req: Request, res: Response) => {
    const { ...applicationInfo } = req.body;
    const { jobId } = req.params;

    const applicationData = await ApplicationServices.applicationCreate(
      applicationInfo,
      jobId,
      req.user
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "application Create Successfully",
      data: applicationData,
    });
  }
);

const acceptApplication = catchAsyncError(
  async (req: Request, res: Response) => {
    const { jobSeeker_id,jobId } = req.params;
    // const { jobId } = req.body;

    const applicationData = await ApplicationServices.acceptApplication(
      jobSeeker_id,
       jobId,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "application accepted Successfully",
      data: applicationData,
    });
  }
);

const rejectApplication = catchAsyncError(
  async (req: Request, res: Response) => {
    const { jobSeeker_id,jobId } = req.params;
    // const { jobId } = req.body;

    const applicationData = await ApplicationServices.rejectApplication(
      jobSeeker_id,
            jobId,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "application Rejected Successfully",
      data: applicationData,
    });
  }
);

const gettingAppliedJobsForUser = catchAsyncError(
  async (req: Request, res: Response) => {
    // console.log("ggg", req.user);
    const applicationData = await ApplicationServices.gettingAppliedJobsForUser(
      req.user
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "jobs getting Successfully",
      data: applicationData,
    });
  }
);

const alreadyAppliedJob = catchAsyncError(async (req: Request, res: Response) => {
      const { jobId } = req.params;
      console.log("controllerxxx : ", req.user)
    const applicationData = await ApplicationServices.alreadyAppliedJob(
      req.user,
      jobId
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "already pplied job Successfully",
      data: applicationData,
    });
  }
);


const getApplicantsByJobId = catchAsyncError(
  async (req: Request, res: Response) => {
     const { jobId } = req.params;
    const applicants = await ApplicationServices.getApplicantsByJobId(
      jobId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "applicants getting Successfully",
      data: applicants,
    });
  }
);

export const applicationControllers = {
  applicationCreate,
  gettingAppliedJobsForUser,
  acceptApplication,
  rejectApplication,
  getApplicantsByJobId,
  alreadyAppliedJob,
};
