import { z } from 'zod';

export const createTextSchema = z.object({
  content: z.string().min(1, 'Text content cannot be empty'),
});

export const textIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid text ID'),
});

export const textResponseSchema = z.object({
  data: z.object({
    _id: z.any().transform((val) => val.toString()), // Convert ObjectId to string
    content: z.string(),
    userId: z.string(),
    createdAt: z.date().transform((val) => val.toISOString()), // Convert Date to ISO string
    updatedAt: z.date().transform((val) => val.toISOString()), // Convert Date to ISO string
  }),
  message: z.string().optional(),
});

export const analysisResponseSchema = z.object({
  data: z.object({
    wordCount: z.number().optional(),
    characterCount: z.number().optional(),
    sentenceCount: z.number().optional(),
    paragraphCount: z.number().optional(),
    longestWords: z.union([z.string(), z.array(z.string())]).optional(),
  }),
  message: z.string().optional(),
});

export const userTextsResponseSchema = z.object({
  data: z.array(
    z.object({
      _id: z.any().transform((val) => val.toString()),
      content: z.string(),
      userId: z.string(),
      createdAt: z.date().transform((val) => val.toISOString()),
      updatedAt: z.date().transform((val) => val.toISOString()),
    })
  ),
});

export const userIdSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});