import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';

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

export default app;
