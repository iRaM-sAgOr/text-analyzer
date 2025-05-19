import { Router, Request, Response, NextFunction } from "express";
import { validateRequest } from "../middleware/validation.middleware";
import { createTextSchema } from "../dtos/text.dto";
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
    async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        await textController.createText(req, res, next);
    }
);

export default router;