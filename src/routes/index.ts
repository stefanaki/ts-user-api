import express, { Response } from 'express';
import userRouter from './user.routes';
import authRouter from './auth.routes';

const router = express.Router();

router.get('/healthcheck', (_, res: Response) => res.sendStatus(200));
router.use('/users', userRouter);
router.use('/session', authRouter);

export default router;
