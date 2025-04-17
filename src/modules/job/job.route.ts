import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import {
	authorizeRoles,
	isAuthenticated,
} from '../../middlewares/authentication';
import { JobControllers } from './job.controller';
import { UserRole } from '../../enums/user';

const router = express.Router();

router.post(
	'/create',
	// isAuthenticated(),
	// authorizeRoles(UserRole.EMPLOYER),
	JobControllers.jobCreate
);
router.get('/all', JobControllers.allJob);

export const JobRoutes = router;
