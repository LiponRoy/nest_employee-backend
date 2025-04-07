import express from 'express';
import { isAuthenticated } from '../../middlewares/authentication';
import { profileControllers } from './profile.controller';

const router = express.Router();

router.put(
	'/updateGeneralInfo',
	isAuthenticated(),
	profileControllers.generalInfoUpdate
);
router.put(
	'/updateEducation',
	isAuthenticated(),
	profileControllers.updateEducation
);

router.put(
	'/updateExperience',
	isAuthenticated(),
	profileControllers.updateExperience
);

export const profileRoutes = router;
