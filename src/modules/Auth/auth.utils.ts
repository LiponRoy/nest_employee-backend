import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export const createToken = (
	jwtPayload: { email: string; role: string },
	secret: string,
	expiresIn: string | number // Allowing both string and number for expiresIn
) => {
	return jwt.sign(jwtPayload, secret, {
		expiresIn: '7d',
	});
};

export const verifyToken = (token: string, secret: string) => {
	return jwt.verify(token, secret) as JwtPayload;
};
