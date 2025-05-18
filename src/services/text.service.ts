import { ITextRepository } from "../repositories/Itext.repository";
import { createTextSchema } from "../api/dtos/text.dto";
import { IText } from "../interfaces/text.interface";
import { TextAnalyzer } from "../utils/text.analyzer";

export class TextService {
    private textRepository: ITextRepository;

    constructor(textRepository: ITextRepository) {
        this.textRepository = textRepository;
    }

    async createText(dto: {content: string},userId: string): Promise<IText> {
        createTextSchema.parse(dto);
        const text:IText = {
            content: dto.content,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        return this.textRepository.createText(text);
    }

    async getWordCount(id: string, userId: string): Promise<number> {
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            throw new Error("Text not found or user not authorized");
        }

        const count = TextAnalyzer.countWords(text.content);
        return count;
    }
}