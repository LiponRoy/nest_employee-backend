import express from 'express';

import { applicationControllers } from './application.controller';
import {
	authorizeRoles,
	isAuthenticated,
} from '../../middlewares/authentication';
import { UserRole } from '../../enums/user';

const router = express.Router();

router.get(
	'/appliedJobsAll',
	isAuthenticated(),
	applicationControllers.gettingAppliedJobsForUser
);

router.post(
	'/create/:jobId',
	isAuthenticated(),
	authorizeRoles(UserRole.JOB_SEEKER),
	applicationControllers.applicationCreate
);

router.get(
	'/getApplicantsByJobId/:jobId',
	// isAuthenticated(),
	// authorizeRoles(UserRole.JOB_SEEKER),
	applicationControllers.getApplicantsByJobId
);

router.patch(
	'/accept/:jobSeeker_id/:jobId',
	// isAuthenticated(),
	// authorizeRoles(UserRole.JOB_SEEKER),
	applicationControllers.acceptApplication
);

router.patch(
	'/reject/:jobSeeker_id/:jobId',
	// isAuthenticated(),
	// authorizeRoles(UserRole.JOB_SEEKER),
	applicationControllers.rejectApplication
);

router.get(
	'/is-applied/:jobId',
	isAuthenticated(),
	// authorizeRoles(UserRole.JOB_SEEKER),
	applicationControllers.alreadyAppliedJob
);

export const ApplicationRoutes = router;
