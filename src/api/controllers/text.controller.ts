import { Request, Response, NextFunction, text } from 'express';
import { TextService } from '../../services/text.service';
import { textResponseSchema } from '../dtos/text.dto';

export class TextController {
    private textService: TextService;

    constructor(textService: TextService) {
        this.textService = textService;
    }

    async createText(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = '10'; // Replace with actual user ID from request context
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
}