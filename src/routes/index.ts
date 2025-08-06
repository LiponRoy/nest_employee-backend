import { Router } from 'express';
import { ApplicationRoutes } from '../modules/application/application.route';
import { CompanyRoutes } from '../modules/company/company.route';
import { JobRoutes } from '../modules/job/job.route';
import { profileRoutes } from '../modules/profile/profile.route';
import { authRoutes } from '@modules/acl/auth.route';


const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path:'/profile',
    route:profileRoutes,
  },
  {
    path:'/company',
    route:CompanyRoutes,

  },

	{	path: '/job',
		route: JobRoutes,
	},

	{	path: '/application',
		route: ApplicationRoutes,
	}
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
