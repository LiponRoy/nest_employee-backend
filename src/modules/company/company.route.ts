import express from 'express';

import { CompanyValidation } from './company.validation';
import validateRequest from '../../middlewares/validateRequest';
import { isAuthenticated } from '../../middlewares/authentication';
import { CompanyControllers } from './company.controller';

const router = express.Router();

router.post(
	'/create',
	isAuthenticated(),
	// validateRequest(CompanyValidation.companyValidationZodSchema),
	CompanyControllers.companyCreate
);

export const CompanyRoutes = router;
