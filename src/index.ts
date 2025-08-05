import mongoose from 'mongoose';
import config from './config';

import { Server } from 'http';
import app from './app';

let server: Server;
//console.log(ab);
const main = async () => {
	try {
		// Mongodb connection
		await mongoose.connect(config.mongodb_url as string);
		console.log('Mongodb Connected');
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
