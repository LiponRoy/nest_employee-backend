import express from 'express';
import { isAuthenticated } from '../../middlewares/authentication';
import { profileControllers } from './profile.controller';

const router = express.Router();

router.post('/create', isAuthenticated(), profileControllers.profileCreate);

export const profileRoutes = router;
