"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authentication_1 = require("../../middlewares/authentication");
const job_controller_1 = require("./job.controller");
const user_1 = require("../../enums/user");
const multerMiddleware_1 = __importDefault(require("../../middlewares/multerMiddleware"));
const router = express_1.default.Router();
router.post("/create", (0, authentication_1.isAuthenticated)(), (0, authentication_1.authorizeRoles)(user_1.UserRole.EMPLOYER), multerMiddleware_1.default.single("logoImage"), job_controller_1.JobControllers.jobCreate);
router.get("/all", job_controller_1.JobControllers.allJob);
router.get("/getJobByCreator", (0, authentication_1.isAuthenticated)(), (0, authentication_1.authorizeRoles)(user_1.UserRole.EMPLOYER), job_controller_1.JobControllers.getJobByCreator);
router.get("/:id", job_controller_1.JobControllers.getJobById);
router.delete("/:jobId", (0, authentication_1.isAuthenticated)(), (0, authentication_1.authorizeRoles)(user_1.UserRole.EMPLOYER), job_controller_1.JobControllers.deleteJobById);
exports.JobRoutes = router;
