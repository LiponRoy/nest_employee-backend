import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
	port: process.env.PORT,
	mongodb_url: process.env.MONGODB,
	node_env: process.env.NODE_ENV,

	bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
	jwt_auth_secret: process.env.JWT_AUTH_SECRATE,
	jwt_auth_expires_in: process.env.JWT_AUTH_EXPIRES_IN,

	frontend_URL: process.env.FRONTEND_URL,
};
