import express from "express";

import validateRequest from "../../middlewares/validateRequest";
import {
    authorizeRoles,
    isAuthenticated,
} from "../../middlewares/authentication";
import { JobControllers } from "./job.controller";
import { UserRole } from "../../enums/user";
import upload from "../../middlewares/multerMiddleware";

const router = express.Router();

router.post(
    "/create",
    isAuthenticated(),
    authorizeRoles(UserRole.EMPLOYER),
    upload.single("logoImage"),
    JobControllers.jobCreate
);
router.get("/all", JobControllers.allJob);

router.get(
    "/getJobByCreator",
    isAuthenticated(),
    authorizeRoles(UserRole.EMPLOYER),
    JobControllers.getJobByCreator
);

router.get("/:id", JobControllers.getJobById);
router.delete(
    "/:jobId",
    isAuthenticated(),
    authorizeRoles(UserRole.EMPLOYER),
    JobControllers.deleteJobById
);

export const JobRoutes = router;
