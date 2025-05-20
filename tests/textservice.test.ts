import { TextService } from "../src/services/text.service";
import { ITextRepository } from "../src/repositories/Itext.repository";
import { IText } from "../src/interfaces/text.interface";
import { TextAnalyzer } from "../src/utils/text.analyzer";
import { cache } from "../src/utils/cache";

jest.mock('../src/utils/cache', () => ({
    cache: {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
        quit: jest.fn(),
    },
}));

jest.mock('../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// Do NOT mock TextAnalyzer. Only mock the repository.
const mockText: IText = {
    content: "Hello world. This is a test.\n\nNew paragraph.",
    userId: "user1",
    createdAt: new Date(),
    updatedAt: new Date(),
};

const mockRepository = {
    createText: jest.fn(),
    getTextById: jest.fn(),
    updateText: jest.fn(),
    deleteText: jest.fn(),
    getTextByUserId: jest.fn(),
} as unknown as ITextRepository;

describe("Text Service", () => {
    let service: TextService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new TextService(mockRepository);
    });

    afterAll(async () => {
        await cache.quit();
    });

    describe("createText", () => {
        it("should create a new text", async () => {
            // Mock the Repository Method
            mockRepository.createText = jest.fn().mockResolvedValue(mockText);
            const result = await service.createText("Hello", "user1");
            expect(mockRepository.createText).toHaveBeenCalled();
            expect(result).toEqual(mockText);
        });
    });

    describe("getWordCount", () => {
        it("should return word count for valid text and user", async () => {
            mockRepository.getTextById = jest.fn().mockResolvedValue(mockText);
            // Use the real TextAnalyzer
            const expected = TextAnalyzer.countWords(mockText.content);
            const result = await service.getWordCount("id1", "user1");
            expect(result).toBe(expected);
        });

        it("should throw error if text not found", async () => {
            mockRepository.getTextById = jest.fn().mockResolvedValue(null);
            await expect(service.getWordCount("id1", "user1")).rejects.toThrow("Text not found or user not authorized");
        });

        it("should throw error if user not authorized", async () => {
            mockRepository.getTextById = jest.fn().mockResolvedValue(mockText);
            await expect(service.getWordCount("id1", "user2")).rejects.toThrow("Text not found or user not authorized");
        });
    });

    describe("getCharacterCount", () => {
        it("should return character count", async () => {
            mockRepository.getTextById = jest.fn().mockResolvedValue(mockText);
            const expected = TextAnalyzer.countCharacters(mockText.content, true);
            const result = await service.getCharacterCount("id1", "user1", true);
            expect(result).toBe(expected);
        });
    });

    describe("getSentenceCount", () => {
        it("should return sentence count", async () => {
            mockRepository.getTextById = jest.fn().mockResolvedValue(mockText);
            const expected = TextAnalyzer.countSentences(mockText.content);
            const result = await service.getSentenceCount("id1", "user1");
            expect(result).toBe(expected);
        });
    });

    describe("getParagraphCount", () => {
        it("should return paragraph count", async () => {
            mockRepository.getTextById = jest.fn().mockResolvedValue(mockText);
            const expected = TextAnalyzer.countParagraphs(mockText.content);
            const result = await service.getParagraphCount("id1", "user1");
            expect(result).toBe(expected);
        });
    });

    describe("getLongestWords", () => {
        it("should return longest words", async () => {
            mockRepository.getTextById = jest.fn().mockResolvedValue(mockText);
            const expected = TextAnalyzer.findLongestWords(mockText.content, true);
            const result = await service.getLongestWords("id1", "user1", true);
            expect(result).toEqual(expected);
        });
    });

    describe("updateText", () => {
        it("should update text content", async () => {
            mockRepository.getTextById = jest.fn().mockResolvedValue(mockText);
            mockRepository.updateText = jest.fn().mockResolvedValue({ ...mockText, content: "Updated" });
            const result = await service.updateText("id1", "Updated", "user1");
            expect(result.content).toBe("Updated");
        });

        it("should throw error if text not found or user not authorized", async () => {
            mockRepository.getTextById = jest.fn().mockResolvedValue(null);
            await expect(service.updateText("id1", "Updated", "user1")).rejects.toThrow("Text not found or user not authorized");
        });

        it("should throw error if update fails", async () => {
            mockRepository.getTextById = jest.fn().mockResolvedValue(mockText);
            mockRepository.updateText = jest.fn().mockResolvedValue(null);
            await expect(service.updateText("id1", "Updated", "user1")).rejects.toThrow("Text with id id1 not found");
        });
    });

    describe("deleteText", () => {
        it("should delete text", async () => {
            mockRepository.getTextById = jest.fn().mockResolvedValue(mockText);
            mockRepository.deleteText = jest.fn().mockResolvedValue(true);
            const result = await service.deleteText("id1", "user1");
            expect(result).toBe(true);
        });

        it("should throw error if text not found or user not authorized", async () => {
            mockRepository.getTextById = jest.fn().mockResolvedValue(null);
            await expect(service.deleteText("id1", "user1")).rejects.toThrow("Text not found or user not authorized");
        });
    });

    describe("getTextByUserId", () => {
        it("should return texts for user", async () => {
            mockRepository.getTextByUserId = jest.fn().mockResolvedValue([mockText]);
            const result = await service.getTextByUserId("user1");
            expect(result).toEqual([mockText]);
        });

        it("should throw error if no texts found", async () => {
            mockRepository.getTextByUserId = jest.fn().mockResolvedValue(null);
            await expect(service.getTextByUserId("user1")).rejects.toThrow("No texts found for this user");
        });
    });
});