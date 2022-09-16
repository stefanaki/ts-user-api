import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

const validateResource =
	(schema: AnyZodObject) =>
	(req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse({
				body: req.body,
				query: req.query,
				params: req.params
			});

			next();
		} catch (e: any) {
			if (e instanceof ZodError) return res.status(400).json(e.flatten());
			else return res.sendStatus(500);
		}
	};

export default validateResource;
