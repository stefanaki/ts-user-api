import { object, string, TypeOf } from 'zod';

export const createSessionSchema = object({
	body: object({
		email: string({ required_error: 'E-mail is required' }).email(
			'Invalid e-mail or password'
		),
		password: string().min(6, 'Invalid e-mail or password')
	})
});

export type CreateSessionInput = TypeOf<typeof createSessionSchema>['body'];