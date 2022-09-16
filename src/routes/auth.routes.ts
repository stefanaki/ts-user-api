import express from 'express';
import validateResource from '../middleware/validateResource';
import { createSessionHandler, refreshAccessTokenHandler } from '../controllers/auth.controller';
import { createSessionSchema } from '../schemas/auth.schema';

const router = express.Router();

router.post('/', validateResource(createSessionSchema), createSessionHandler);
router.post('/refresh', refreshAccessTokenHandler);

export default router;
