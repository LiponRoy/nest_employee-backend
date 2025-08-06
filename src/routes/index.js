"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const application_route_1 = require("../modules/application/application.route");
const company_route_1 = require("../modules/company/company.route");
const job_route_1 = require("../modules/job/job.route");
const profile_route_1 = require("../modules/profile/profile.route");
const auth_route_1 = require("@modules/auth/auth.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.authRoutes,
    },
    {
        path: '/profile',
        route: profile_route_1.profileRoutes,
    },
    {
        path: '/company',
        route: company_route_1.CompanyRoutes,
    },
    { path: '/job',
        route: job_route_1.JobRoutes,
    },
    { path: '/application',
        route: application_route_1.ApplicationRoutes,
    }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
