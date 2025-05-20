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
        const createdText = await this.textRepository.createText(text);
        await cache.del(`report:${userId}`);
        logger.info('Text created', { userId, textId: createdText._id });
        return createdText;
    }

    async getWordCount(id: string, userId: string): Promise<number> {
        const cacheKey = `wordCount:${userId}:${id}`;
        const cachedCount = await cache.get(cacheKey);
        if (cachedCount) {
            logger.info('Word count from cache', { userId, textId: id, wordCount: parseInt(cachedCount, 10) });
            return parseInt(cachedCount, 10);
        }
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            logger.error('Text not found or unauthorized', { userId, textId: id });
            throw new AppError("Text not found or user not authorized", 404);
        }
        const count = TextAnalyzer.countWords(text.content);
        await cache.set(cacheKey, count.toString(), 60 * 60);
        logger.info('Word count calculated', { userId, textId: id, wordCount: count });
        return count;
    }

    async getCharacterCount(id: string, userId: string, countWhitespace: boolean = false): Promise<number> {
        const cacheKey = `characters:${userId}:${id}`;
        const cached = await cache.get(cacheKey);
        if (cached) {
            logger.info('Character count from cache', { userId, textId: id, characterCount: parseInt(cached, 10), countWhitespace });
            return parseInt(cached, 10);
        }
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            logger.error('Text not found or unauthorized', { userId, textId: id });
            throw new AppError("Text not found or user not authorized", 404);
        }
        const count = TextAnalyzer.countCharacters(text.content, countWhitespace);
        await cache.set(cacheKey, count.toString(), 3600);
        logger.info('Character count calculated', { userId, textId: id, characterCount: count, countWhitespace });
        return count;
    }

    async getSentenceCount(id: string, userId: string): Promise<number> {
        const cacheKey = `sentences:${userId}:${id}`;
        const cached = await cache.get(cacheKey);
        if (cached) {
            logger.info('Sentence count from cache', { userId, textId: id, sentenceCount: parseInt(cached, 10) });
            return parseInt(cached, 10);
        }
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            logger.error('Text not found or unauthorized', { userId, textId: id });
            throw new AppError("Text not found or user not authorized", 404);
        }
        const count = TextAnalyzer.countSentences(text.content);
        await cache.set(cacheKey, count.toString(), 3600);
        logger.info('Sentence count calculated', { userId, textId: id, sentenceCount: count });
        return count;
    }

    async getParagraphCount(id: string, userId: string): Promise<number> {
        const cacheKey = `paragraphs:${userId}:${id}`;
        const cached = await cache.get(cacheKey);
        if (cached) {
            logger.info('Paragraph count from cache', { userId, textId: id, paragraphCount: parseInt(cached, 10) });
            return parseInt(cached, 10);
        }
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            logger.error('Text not found or unauthorized', { userId, textId: id });
            throw new AppError("Text not found or user not authorized", 404);
        }
        const count = TextAnalyzer.countParagraphs(text.content);
        await cache.set(cacheKey, count.toString(), 3600);
        logger.info('Paragraph count calculated', { userId, textId: id, paragraphCount: count });
        return count;
    }

    async getLongestWords(id: string, userId: string, returnAll: boolean = false): Promise<string | string[]> {
        const cacheKey = `longestWords:${userId}:${id}`;
        const cached = await cache.get(cacheKey);
        if (cached) {
            logger.info('Longest words from cache', { userId, textId: id, longestWords: JSON.parse(cached), returnAll });
            return JSON.parse(cached);
        }
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            logger.error('Text not found or unauthorized', { userId, textId: id });
            throw new AppError("Text not found or user not authorized", 404);
        }
        const longestWords = TextAnalyzer.findLongestWords(text.content, returnAll);
        await cache.set(cacheKey, JSON.stringify(longestWords), 3600);
        logger.info('Longest words calculated', { userId, textId: id, longestWords, returnAll });
        return longestWords;
    }

    async updateText(id: string, content: string, userId: string): Promise<IText> {
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            logger.error('Text not found or unauthorized for update', { userId, textId: id });
            throw new AppError("Text not found or user not authorized", 404);
        }
        const result = await this.textRepository.updateText(id, {content, updatedAt: new Date()});
        if (!result) {
            logger.error('Failed to update text', { userId, textId: id });
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
        logger.info('Text updated and related cache cleared', { userId, textId: id });
        return result;
    }

    async deleteText(id: string, userId: string): Promise<boolean> {
        const text = await this.textRepository.getTextById(id);
        if (!text || text.userId !== userId) {
            logger.error('Text not found or unauthorized for delete', { userId, textId: id });
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
        logger.info('Text deleted and related cache cleared', { userId, textId: id });
        return result;
    }

    async getTextByUserId(userId: string): Promise<IText[]> {
        const texts = await this.textRepository.getTextByUserId(userId);
        if (!texts) {
            logger.error('No texts found for user', { userId });
            throw new AppError("No texts found for this user", 404);
        }
        logger.info('Fetched texts for user', { userId, textCount: texts.length });
        return texts;
    }
}