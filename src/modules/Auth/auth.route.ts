import express from 'express';

import validateRequest from '../../middlewares/validateRequest';
import {
	isAuthenticated,
} from '../../middlewares/authentication';
import { AuthValidation } from './auth.validation';
import { AuthControllers } from './auth.controller';

const router = express.Router();

router.post(
	'/signup',
	validateRequest(AuthValidation.userValidationZodSchema),
	AuthControllers.signupUser
);

router.post(
	'/login',
	validateRequest(AuthValidation.loginValidationSchema),
	AuthControllers.loginUser
);
router.post('/logout', AuthControllers.logout);
router.get('/profile', isAuthenticated(), AuthControllers.profile);

export const authRoutes = router;
