import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import { isAuthenticated } from '../../middlewares/authentication';
import { JobControllers } from './job.controller';

const router = express.Router();

router.post(
	'/create',
	// isAuthenticated(),
	JobControllers.jobCreate
);

export const JobRoutes = router;
