import express from 'express';

import { applicationControllers } from './application.controller';
import { isAuthenticated } from '../../middlewares/authentication';

const router = express.Router();

router.post(
	'/create/:jobId',
	isAuthenticated(),
	applicationControllers.applicationCreate
);

export const ApplicationRoutes = router;
