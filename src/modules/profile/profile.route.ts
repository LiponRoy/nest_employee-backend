import express from 'express';
import { isAuthenticated } from '../../middlewares/authentication';
import { profileControllers } from './profile.controller';

const router = express.Router();

router.put('/update', isAuthenticated(), profileControllers.profileUpdate);

export const profileRoutes = router;
