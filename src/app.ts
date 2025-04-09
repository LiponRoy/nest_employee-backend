import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';
import { AuthRoutes } from './modules/auth/auth.route';
import { CompanyRoutes } from './modules/company/company.route';
import { JobRoutes } from './modules/job/job.route';
import { ApplicationRoutes } from './modules/application/application.route';
import { profileRoutes } from './modules/profile/profile.route';
import config from './config';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cookieParser());
//middlewares
// app.use(cors());
app.use(
	cors({
		origin: config.frontend_URL,
		credentials: true, // Allow cookies
	})
);

app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/company', CompanyRoutes);
app.use('/api/v1/job', JobRoutes);
app.use('/api/v1/application', ApplicationRoutes);

// Testing
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
	res.send('This is Testing Router...');
});

// error middleware ...
app.use(globalErrorHandler);

// Not found error middleware
app.use(notFound);

export default app;
