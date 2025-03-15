import express from 'express';

import { CompanyValidation } from './company.validation';
import validateRequest from '../../middlewares/validateRequest';
import {
	authorizeRoles,
	isAuthenticated,
} from '../../middlewares/authentication';
import { CompanyControllers } from './company.controller';
import { UserRole } from '../../enums/user';

const router = express.Router();

router.post(
	'/create',
	isAuthenticated(),
	authorizeRoles(UserRole.EMPLOYER),
	// validateRequest(CompanyValidation.companyValidationZodSchema),
	CompanyControllers.companyCreate
);

export const CompanyRoutes = router;
