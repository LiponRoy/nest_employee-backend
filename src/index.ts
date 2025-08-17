import 'module-alias/register';
import mongoose from 'mongoose';
import config from './config';

import { Server } from 'http';
import app from './app';
// import { getRedisClient } from '@utils/redisClient';
import { connectDB } from './utils/db';

let server: Server;
//console.log(ab);
const main = async () => {
	try {
		// Mongodb connection
		await connectDB();

		// Server creation
		server = app.listen(config.port, () => {
			console.log(`App listening on port -YES.  ${config.port}`);
		});
	} catch (error) {
		console.log(`Failed to connect database ${error}`);
	}
	//...........
};
main();
