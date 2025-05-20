import { Router, Request, Response, NextFunction } from "express";
import { validateRequest } from "../middleware/validation.middleware";
import { createTextSchema, textIdSchema, userIdSchema } from "../dtos/text.dto";
import { TextRepository } from "../../repositories/text.repository";
import { TextService } from "../../services/text.service";
import { TextController } from "../controllers/text.controller";
import { textModel } from "../../models/text.model";

const router = Router();

const textRepository = new TextRepository(textModel);
const textService = new TextService(textRepository);
const textController = new TextController(textService);

/**
 * @swagger
 * /api/texts:
 *   post:
 *     summary: Create a new text
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               userId:
 *                 type: string
 *             required:
 *               - content
 *               - userId
 *     responses:
 *       201:
 *         description: Text created successfully
 */
router.post(
    '/',
    validateRequest(createTextSchema.merge(userIdSchema)),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.createText(req, res, next);
    });

/**
 * @swagger
 * /api/texts/{id}/word-count:
 *   get:
 *     summary: Get word count for a text
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Text ID
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Word count result
 */
router.get('/:id/word-count', 
    validateRequest(textIdSchema, 'params'),
    validateRequest(userIdSchema, 'query'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.getWordCount(req, res, next);
    });

/**
 * @swagger
 * /api/texts/{id}/character-count:
 *   get:
 *     summary: Get character count for a text
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Text ID
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Character count result
 */
router.get('/:id/character-count', 
    validateRequest(textIdSchema, 'params'),
    validateRequest(userIdSchema, 'query'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.getCharacterCount(req, res, next);
    });

/**
 * @swagger
 * /api/texts/{id}/sentence-count:
 *   get:
 *     summary: Get sentence count for a text
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Text ID
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Sentence count result
 */
router.get('/:id/sentence-count', 
    validateRequest(textIdSchema, 'params'),
    validateRequest(userIdSchema, 'query'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.getSentenceCount(req, res, next);
    });

/**
 * @swagger
 * /api/texts/{id}/paragraph-count:
 *   get:
 *     summary: Get paragraph count for a text
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Text ID
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Paragraph count result
 */
router.get('/:id/paragraph-count', 
    validateRequest(textIdSchema, 'params'),
    validateRequest(userIdSchema, 'query'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.getParagraphCount(req, res, next);
    });

/**
 * @swagger
 * /api/texts/{id}/longest-words:
 *   get:
 *     summary: Get longest words in a text
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Text ID
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Longest words result
 */
router.get('/:id/longest-words', 
    validateRequest(textIdSchema, 'params'),
    validateRequest(userIdSchema, 'query'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.getLongestWords(req, res, next);
    });

/**
 * @swagger
 * /api/texts/{id}:
 *   put:
 *     summary: Update a text
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Text ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               userId:
 *                 type: string
 *             required:
 *               - content
 *               - userId
 *     responses:
 *       200:
 *         description: Text updated successfully
 */
router.put('/:id', 
    validateRequest(createTextSchema.merge(textIdSchema).merge(userIdSchema)),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.updateText(req, res, next);
    }
);

/**
 * @swagger
 * /api/texts/{id}:
 *   delete:
 *     summary: Delete a text
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Text ID
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       204:
 *         description: Text deleted successfully
 */
router.delete('/:id', 
    validateRequest(textIdSchema, 'params'),
    validateRequest(userIdSchema, 'query'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.deleteText(req, res, next);
    });

/**
 * @swagger
 * /api/texts:
 *   get:
 *     summary: Get all texts for a user
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of texts for the user
 */
router.get('/', 
    validateRequest(userIdSchema, 'query'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.getUserTexts(req, res, next);
    });

export default router;