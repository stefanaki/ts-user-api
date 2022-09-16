import { Request, Response } from 'express';
import {
	CreateUserInput,
	ForgotPasswordInput,
	VerifyUserInput,
	ResetPasswordInput
} from '../schemas/user.schema';
import {
	createUser,
	findUserById,
	findUserByEmail
} from '../services/user.service';
import { sendEmail } from '../utils/mailer';
import log from '../utils/logger';
import { nanoid } from 'nanoid';

export async function createUserHandler(
	req: Request<{}, {}, CreateUserInput>,
	res: Response
) {
	const body = req.body;

	try {
		const user = await createUser(body);
		await sendEmail({
			from: 'test@example.com',
			to: user.email,
			subject: 'Please verify your account',
			text: `Verification code: ${user.verificationCode}\nID: ${user._id}`
		});
		return res.status(201).json({ message: 'User successfully created' });
	} catch (e: any) {
		console.log(e);

		if (e.code === 11000) {
			return res.status(409).json({ message: 'Account already exists' });
		} else {
			res.status(500).json({ message: 'Internal server error' });
		}
	}
}

export async function verifyUserHandler(
	req: Request<VerifyUserInput, {}, {}>,
	res: Response
) {
	const { id, verificationCode } = req.params;

	// Find user by ID
	const user = await findUserById(id);

	if (!user) res.status(404).json({ message: 'User not found' });

	// Check if user is already verified
	if (user?.verified) {
		return res.status(400).json({ message: 'User already verified' });
	}

	// Check if verificationCode is correct
	if (user?.verificationCode !== verificationCode) {
		return res.status(400).json({ message: 'Invalid verification code' });
	}

	// Verify user
	user.verified = true;
	await user.save();

	return res.status(200).json({ message: 'User verified successfully' });
}

export async function forgotPasswordHandler(
	req: Request<{}, {}, ForgotPasswordInput>,
	res: Response
) {
	const { email } = req.body;
	const message = 'A password reset e-mail has been sent to your address';

	const user = await findUserByEmail(email);

	if (!user) {
		log.debug(`User with e-mail ${email} does not exist`);
		// We don't want the attacker to know which e-mails are registered
		return res.status(200).json({ message });
	}

	if (!user?.verified) {
		return res.status(400).json({ message: 'User is not verified' });
	}

	const passwordResetCode = nanoid();
	user.passwordResetCode = passwordResetCode;
	user?.save();

	await sendEmail({
		to: user.email,
		from: 'test@example.com',
		subject: 'Reset you password',
		text: `Password reset code: ${passwordResetCode}\nID: ${user._id}`
	});

	return res.status(200).json({ message });
}

export async function resetPasswordHandler(
	req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>,
	res: Response
) {
	const { id, passwordResetCode } = req.params;
	const { password } = req.body;

	const user = await findUserById(id);

	if (
		!user ||
		!user.passwordResetCode ||
		user.passwordResetCode !== passwordResetCode
	) {
		return res.status(400).json({ message: 'Could not reset user password' });
	}

	user.passwordResetCode = null;
	user.password = password;
	await user.save();

	return res.status(200).json({ message: 'Password was reset successfully' });
}

export async function getCurrentUserHandler(req: Request, res: Response) {
	return res.status(200).json({ user: res.locals.user });
}
