import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import router from './routes';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';

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

// application routes
app.use('/api/v1', router);

// Testing
app.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.send('Hi Nest Employee...');
});

// error middleware ...
app.use(globalErrorHandler);

// Not found error middleware
app.use(notFound);

export default app;
