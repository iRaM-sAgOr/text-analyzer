import { ITextRepository } from "../repositories/Itext.repository";
import { IText } from "../interfaces/text.interface";
import { TextAnalyzer } from "../utils/text.analyzer";

export class TextService {
    private textRepository: ITextRepository;

    constructor(textRepository: ITextRepository) {
        this.textRepository = textRepository;
    }

    async createText(content: string, userId: string): Promise<IText> {
        const text: IText = {
            content,
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

    async getCharacterCount(id: string, userId: string, countWhitespace: boolean = false): Promise<number> {
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            throw new Error("Text not found or user not authorized");
        }

        const count = TextAnalyzer.countCharacters(text.content, countWhitespace);
        return count;
    }

    async getSentenceCount(id: string, userId: string): Promise<number> {
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            throw new Error("Text not found or user not authorized");
        }

        const count = TextAnalyzer.countSentences(text.content);
        return count;
    }

    async getParagraphCount(id: string, userId: string): Promise<number> {
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            throw new Error("Text not found or user not authorized");
        }

        const count = TextAnalyzer.countParagraphs(text.content);
        return count;
    }

    async getLongestWords(id: string, userId: string, returnAll: boolean = false): Promise<string | string[]> {
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            throw new Error("Text not found or user not authorized");
        }

        const longestWords = TextAnalyzer.findLongestWords(text.content, returnAll);
        return longestWords;
    }

    async updateText(id: string, content: string, userId: string): Promise<IText> {
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            throw new Error("Text not found or user not authorized");
        }

        const updatedText: IText = {
            ...text,
            content,
            updatedAt: new Date(),
        }
        const result = await this.textRepository.updateText(id, updatedText);
        if (!result) {
            throw new Error(`Text with id ${id} not found`);
        }
        return result;
    }

    async deleteText(id: string, userId: string): Promise<boolean> {
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            throw new Error("Text not found or user not authorized");
        }

        const result = await this.textRepository.deleteText(id);
        return result;
    }

    async getTextByUserId(userId: string): Promise<IText[]> {
        const texts = await this.textRepository.getTextByUserId(userId);
        if (!texts) {
            throw new Error("No texts found for this user");
        }
        return texts;
    }


}