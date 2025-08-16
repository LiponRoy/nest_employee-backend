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
app.use(express.urlencoded({ extended: true }));
//middlewares
const allowedOrigins = [
  config.frontend_URL,
  config.frontend_deployed_URL,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`CORS blocked.: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


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
