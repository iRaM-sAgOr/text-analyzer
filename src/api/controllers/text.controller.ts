import { Request, Response, NextFunction, text } from 'express';
import { TextService } from '../../services/text.service';
import { analysisResponseSchema, textResponseSchema, userTextsResponseSchema } from '../dtos/text.dto';

export class TextController {
    private textService: TextService;

    constructor(textService: TextService) {
        this.textService = textService;
    }

    async createText(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.body.userId; // Get userId from request body
            const text = await this.textService.createText(req.body.content, userId);
            const response = textResponseSchema.parse({
                data: text,
                message: 'Text created successfully',
            });
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getWordCount(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.query.userId as string; // Get userId from query params
            const count = await this.textService.getWordCount(id, userId);
            const response = analysisResponseSchema.parse({ data: { wordCount: count } });
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getCharacterCount(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.query.userId as string; // Get userId from query params
            const count = await this.textService.getCharacterCount(id, userId);
            const response = analysisResponseSchema.parse({ data: { characterCount: count } });
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getSentenceCount(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.query.userId as string; // Get userId from query params
            const count = await this.textService.getSentenceCount(id, userId);
            const response = analysisResponseSchema.parse({ data: { sentenceCount: count } });
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getParagraphCount(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.query.userId as string; // Get userId from query params
            const count = await this.textService.getParagraphCount(id, userId);
            const response = analysisResponseSchema.parse({ data: { paragraphCount: count } });
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async getLongestWords(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.query.userId as string; // Get userId from query params
            const returnAll = (req.query.returnAll && true) || false;
            const longestWords = await this.textService.getLongestWords(id, userId, returnAll);
            const response = analysisResponseSchema.parse({ data: { longestWords } });
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async updateText(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.body.userId; // Get userId from request body
            const updatedText = await this.textService.updateText(id, req.body.content, userId);
            const response = textResponseSchema.parse({ data: updatedText });
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    async deleteText(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const userId = req.query.userId as string; // Get userId from query params
            await this.textService.deleteText(id, userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getUserTexts(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.query.userId as string; // Get userId from query params
            const texts = await this.textService.getTextByUserId(userId);
            const response = userTextsResponseSchema.parse({ data: texts });
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}