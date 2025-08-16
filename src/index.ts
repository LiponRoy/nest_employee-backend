import 'module-alias/register';
import mongoose from 'mongoose';
import config from './config';

import { Server } from 'http';
import app from './app';
import { connectRedis } from '@utils/redisClient';

let server: Server;
//console.log(ab);
const main = async () => {
	try {
		// Mongodb connection
		await mongoose.connect(config.mongodb_url as string);
		console.log('Mongodb Connected');

		// Redis connection
    await connectRedis(); // ✅ connect once at startup
    console.log('✅ Redis Connected');
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
