import { Router, Request, Response, NextFunction } from "express";
import { validateRequest } from "../middleware/validation.middleware";
import { createTextSchema, textIdSchema } from "../dtos/text.dto";
import { TextRepository } from "../../repositories/text.repository";
import { TextService } from "../../services/text.service";
import { TextController } from "../controllers/text.controller";
import { textModel } from "../../models/text.model";

const router = Router();

const textRepository = new TextRepository(textModel);
const textService = new TextService(textRepository);
const textController = new TextController(textService);


router.post(
    '/',
    validateRequest(createTextSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.createText(req, res, next);
    });


router.get('/:id/word-count', validateRequest(textIdSchema, 'params'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.getWordCount(req, res, next);
    })

router.get('/:id/character-count', validateRequest(textIdSchema, 'params'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.getCharacterCount(req, res, next);
    })

router.get('/:id/sentence-count', validateRequest(textIdSchema, 'params'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.getSentenceCount(req, res, next);
    })

router.get('/:id/paragraph-count', validateRequest(textIdSchema, 'params'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.getParagraphCount(req, res, next);
    })

router.get('/:id/longest-words', validateRequest(textIdSchema, 'params'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.getLongestWords(req, res, next);
    });

router.put('/:id', validateRequest(createTextSchema.merge(textIdSchema)),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.updateText(req, res, next);
    }
);

router.delete('/:id', validateRequest(textIdSchema, 'params'),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.deleteText(req, res, next);
    });



export default router;