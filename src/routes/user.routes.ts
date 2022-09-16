import express from 'express';
import validateResource from '../../middleware/validateResource';
import {
	createUserHandler,
	forgotPasswordHandler,
	resetPasswordHandler,
	verifyUserHandler
} from '../controllers/user.controller';
import {
	createUserSchema,
	forgotPasswordSchema,
	resetPasswordSchema,
	verifyUserSchema
} from '../schemas/user.schema';

const router = express.Router();

router.post('/', validateResource(createUserSchema), createUserHandler);

router.post(
	'/verify/:id/:verificationCode',
	validateResource(verifyUserSchema),
	verifyUserHandler
);

router.post(
	'/forgotpassword',
	validateResource(forgotPasswordSchema),
	forgotPasswordHandler
);

router.post(
	'/resetpassword/:id/:passwordResetCode',
	validateResource(resetPasswordSchema),
	resetPasswordHandler
);

export default router;
