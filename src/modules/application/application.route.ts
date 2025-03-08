import express from 'express';

import { applicationControllers } from './application.controller';

const router = express.Router();

router.post('/create', applicationControllers.applicationCreate);

export const ApplicationRoutes = router;
