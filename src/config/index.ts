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
	frontend_deployed_URL: process.env.FRONTEND_DEPLOYED_URL,

	cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
	cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
	
	redis: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT!),
    password: process.env.REDIS_PASSWORD!,
    tls: process.env.REDIS_TLS === "true" ? {} : undefined,
	redis_url:process.env.REDIS_URL
  },
  cache: {
    ttl: Number(process.env.REDIS_CACHE_TTL) || 300, // default 5 min.
  },
};
