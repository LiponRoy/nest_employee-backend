"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const application_controller_1 = require("./application.controller");
const authentication_1 = require("../../middlewares/authentication");
const user_1 = require("../../enums/user");
const router = express_1.default.Router();
router.get('/appliedJobsAll', (0, authentication_1.isAuthenticated)(), application_controller_1.applicationControllers.gettingAppliedJobsForUser);
router.post('/create/:jobId', (0, authentication_1.isAuthenticated)(), (0, authentication_1.authorizeRoles)(user_1.UserRole.JOB_SEEKER), application_controller_1.applicationControllers.applicationCreate);
router.get('/getApplicantsByJobId/:jobId', 
// isAuthenticated(),
// authorizeRoles(UserRole.JOB_SEEKER),
application_controller_1.applicationControllers.getApplicantsByJobId);
router.patch('/accept/:jobSeeker_id/:jobId', 
// isAuthenticated(),
// authorizeRoles(UserRole.JOB_SEEKER),
application_controller_1.applicationControllers.acceptApplication);
router.patch('/reject/:jobSeeker_id/:jobId', 
// isAuthenticated(),
// authorizeRoles(UserRole.JOB_SEEKER),
application_controller_1.applicationControllers.rejectApplication);
router.get('/is-applied/:jobId', (0, authentication_1.isAuthenticated)(), 
// authorizeRoles(UserRole.JOB_SEEKER),
application_controller_1.applicationControllers.alreadyAppliedJob);
exports.ApplicationRoutes = router;
