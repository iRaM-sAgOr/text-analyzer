import { ITextRepository } from "../repositories/Itext.repository";
import { IText } from "../interfaces/text.interface";
import { TextAnalyzer } from "../utils/text.analyzer";
import { AppError } from "../middelware/error.middleware";
import { cache } from "../utils/cache";
import logger from "../utils/logger";

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
        const createdText = this.textRepository.createText(text)
        await cache.del(`report:${userId}`);
        logger.info('Text created', {userId, textId: (await createdText)._id});
        return createdText;
    }

    async getWordCount(id: string, userId: string): Promise<number> {
        // checking from cache
        const cacheKey = `wordCount:${userId}:${id}`;
        const cachedCount = await cache.get(cacheKey);
        if (cachedCount) {
            logger.info('Word count from cache', { userId, textId: id, wordCount: parseInt(cachedCount, 10) });
            return parseInt(cachedCount, 10);
        }

        // if not found in cache, get from database
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            logger.error('Text not found or unauthorized', { userId, textId: id });
            throw new AppError("Text not found or user not authorized", 404);
        }

        const count = TextAnalyzer.countWords(text.content);
        await cache.set(cacheKey, count.toString(), 60 * 60); // cache for 1 hour
        logger.info('Word count calculated', { userId, textId: id, wordCount: count });
        return count;
    }

    async getCharacterCount(id: string, userId: string, countWhitespace: boolean = false): Promise<number> {
        const cacheKey = `characters:${userId}:${id}`;
        const cached = await cache.get(cacheKey);
        if (cached) {
            return parseInt(cached, 10);
        }

        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            throw new AppError("Text not found or user not authorized", 404);
        }

        const count = TextAnalyzer.countCharacters(text.content, countWhitespace);
        await cache.set(cacheKey, count.toString(), 3600);
        return count;
    }

    async getSentenceCount(id: string, userId: string): Promise<number> {
        const cacheKey = `sentences:${userId}:${id}`;
        const cached = await cache.get(cacheKey);
        if (cached) {
            return parseInt(cached, 10);
        }
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            throw new AppError("Text not found or user not authorized", 404);
        }

        const count = TextAnalyzer.countSentences(text.content);
        await cache.set(cacheKey, count.toString(), 3600);
        return count;
    }

    async getParagraphCount(id: string, userId: string): Promise<number> {
        const cacheKey = `paragraphs:${userId}:${id}`;
        const cached = await cache.get(cacheKey);
        if (cached) {
            return parseInt(cached, 10);
        }
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            throw new AppError("Text not found or user not authorized", 404);
        }

        const count = TextAnalyzer.countParagraphs(text.content);
        await cache.set(cacheKey, count.toString(), 3600);
        return count;
    }

    async getLongestWords(id: string, userId: string, returnAll: boolean = false): Promise<string | string[]> {
        const cacheKey = `longestWords:${userId}:${id}`;
        const cached = await cache.get(cacheKey);
        if (cached) {
            return JSON.parse(cached);
        }
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            throw new AppError("Text not found or user not authorized", 404);
        }

        const longestWords = TextAnalyzer.findLongestWords(text.content, returnAll);
        await cache.set(cacheKey, JSON.stringify(longestWords), 3600);
        return longestWords;
    }

    async updateText(id: string, content: string, userId: string): Promise<IText> {
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            throw new AppError("Text not found or user not authorized", 404);
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
        await Promise.all([
            cache.del(`words:${userId}:${id}`),
            cache.del(`characters:${userId}:${id}`),
            cache.del(`sentences:${userId}:${id}`),
            cache.del(`paragraphs:${userId}:${id}`),
            cache.del(`longestWords:${userId}:${id}`),
            cache.del(`report:${userId}`),
        ]);
        return result;
    }

    async deleteText(id: string, userId: string): Promise<boolean> {
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            throw new AppError("Text not found or user not authorized", 404);
        }

        const result = await this.textRepository.deleteText(id);
        await Promise.all([
            cache.del(`words:${userId}:${id}`),
            cache.del(`characters:${userId}:${id}`),
            cache.del(`sentences:${userId}:${id}`),
            cache.del(`paragraphs:${userId}:${id}`),
            cache.del(`longestWords:${userId}:${id}`),
            cache.del(`report:${userId}`),
        ]);
        return result;
    }

    async getTextByUserId(userId: string): Promise<IText[]> {
        const texts = await this.textRepository.getTextByUserId(userId);
        if (!texts) {
            throw new AppError("No texts found for this user", 404);
        }
        return texts;
    }


}