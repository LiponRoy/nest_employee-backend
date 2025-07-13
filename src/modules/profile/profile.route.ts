import express from 'express';
import { isAuthenticated } from '../../middlewares/authentication';
import { profileControllers } from './profile.controller';

const router = express.Router();



router.put(
	'/updateGeneralInfo',
	isAuthenticated(),
	profileControllers.generalInfoUpdate
);
router.put('/updateSkills', isAuthenticated(), profileControllers.updateSkills);

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

router.get(
	'/profileDataById/',
	isAuthenticated(),
	profileControllers.getProfileDataById
);

export const profileRoutes = router;
