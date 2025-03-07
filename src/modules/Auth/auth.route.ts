import express from 'express';

import { AuthControllers } from './auth.controller';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';

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

export const AuthRoutes = router;
