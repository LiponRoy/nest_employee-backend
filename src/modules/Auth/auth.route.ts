import express from 'express';

import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';
import {
	authorizeRoles,
	isAuthenticated,
} from '../../middlewares/authentication';

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

export const AuthRoutes = router;
