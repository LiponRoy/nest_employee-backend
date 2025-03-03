import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';

const app: Application = express();

//parsers
app.use(express.json());
//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Testing
app.get('/test', (req: Request, res: Response, next: NextFunction) => {
	res.send('This is Testing Router...');
});

// error middleware ...
app.use(globalErrorHandler);

// Not found error middleware
app.use(notFound);

export default app;
