import { z } from 'zod';

export const createTextSchema = z.object({
  content: z.string().min(1, 'Text content cannot be empty'),
});