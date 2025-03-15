import express from 'express';

import { applicationControllers } from './application.controller';
import {
	authorizeRoles,
	isAuthenticated,
} from '../../middlewares/authentication';
import { UserRole } from '../../enums/user';

const router = express.Router();

router.post(
	'/create/:jobId',
	isAuthenticated(),
	authorizeRoles(UserRole.JOB_SEEKER),
	applicationControllers.applicationCreate
);

export const ApplicationRoutes = router;
