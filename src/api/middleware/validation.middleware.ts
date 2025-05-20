import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateRequest = (schema: ZodSchema, source: 'body' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // schema.parse(req[source]);
      schema.parse({ ...req.body, ...req.params });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          message: 'Validation failed',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
          })),
          issue: error.errors
        });
      } else {
        next(error);
      }
    }
  };
};