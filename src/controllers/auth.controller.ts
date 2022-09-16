import { Request, Response } from 'express';
import { get } from 'lodash';
import { CreateSessionInput } from '../schemas/auth.schema';
import {
	findSessionById,
	signAccessToken,
	signRefreshToken
} from '../services/auth.service';
import { findUserByEmail, findUserById } from '../services/user.service';
import { verifyJwt } from '../utils/jwt';

export async function createSessionHandler(
	req: Request<{}, {}, CreateSessionInput>,
	res: Response
) {
	const { email, password } = req.body;
	const message = 'Invalid e-mail or password';

	const user = await findUserByEmail(email);

	if (!user) return res.status(400).json({ message });
	if (!user.verified)
		return res
			.status(400)
			.json({ message: 'User with specified e-mail is not verified' });

	const isValid = await user.validatePassword(password);
	if (!isValid) return res.status(400).json({ message });

	const accessToken = signAccessToken(user);
	const refreshToken = await signRefreshToken({ userId: user._id });

	return res
		.status(200)
		.json({ message: 'Log-in successful', accessToken, refreshToken });
}

export async function refreshAccessTokenHandler(req: Request, res: Response) {
	const refreshToken = get(req, 'headers.x-refresh');
	const decoded = verifyJwt<{ session: string }>(
		refreshToken,
		'refreshTokenPublicKey'
	);

	if (!decoded)
		return res.status(401).json({ message: 'Could not refresh access token' });

	const session = await findSessionById(decoded.session);

	if (!session || !session.valid)
		return res.status(401).json({ message: 'Could not refresh access token' });

	const user = await findUserById(String(session.user));
	if (!user)
		return res.status(401).json({ message: 'Could not refresh access token' });

	const accessToken = signAccessToken(user);

	return res
		.status(200)
		.json({ message: 'Access token refreshed successfully', accessToken });
}
