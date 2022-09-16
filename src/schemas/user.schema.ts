import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
	body: object({
		firstName: string({
			required_error: 'First name is required'
		}),
		lastName: string({
			required_error: 'Last name is required'
		}),
		password: string({
			required_error: 'Password is required'
		}).min(6, 'Password should be more than six characters'),
		passwordConfirmation: string({
			required_error: 'Password confirmation is required'
		}),
		email: string({
			required_error: 'E-mail is required'
		}).email('E-mail is not valid')
	}).refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation']
	})
});

export const verifyUserSchema = object({
	params: object({
		id: string(),
		verificationCode: string()
	})
});

export const forgotPasswordSchema = object({
	body: object({
		email: string({
			required_error: 'E-mail is required'
		}).email('Not a valid e-mail address')
	})
});

export const resetPasswordSchema = object({
	params: object({
		id: string({
			required_error: 'User ID is required'
		}),
		passwordResetCode: string({
			required_error: 'Password reset code is required'
		})
	}),
	body: object({
		password: string({
			required_error: 'Password is required'
		}).min(6, 'Password should be more than six characters'),
		passwordConfirmation: string({
			required_error: 'Password confirmation is required'
		})
	}).refine((data) => data.password === data.passwordConfirmation, {
		message: 'Passwords do not match',
		path: ['passwordConfirmation']
	})
});

export type CreateUserInput = TypeOf<typeof createUserSchema>['body'];
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>['params'];
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>;
