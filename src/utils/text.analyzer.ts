export class TextAnalyzer {
    static countWords(paragraph: string): number {
        if (!paragraph || paragraph.trim() === '') {
            return 0;
        }
        // Split by any occurrence of one or more whitespace characters.
        // The trim() ensures leading/trailing whitespace doesn't create empty strings at the ends.
        const words = paragraph.trim().split(/\s+/);
        // The result of split on a non-empty string with /\s+/ will not contain empty strings.
        return words.length;
    }

    static countCharacters(text: string, countWhitespace: boolean = false): number {
        if (!text) {
            return 0;
        }

        if (countWhitespace) {
            return text.length;
        } else {
            // Remove all whitespace characters before counting
            return text.replace(/\s/g, '').length;
        }
    }

    static countSentences(paragraph: string): number {
        if (!paragraph || typeof paragraph !== 'string') {
            return 0; // Return 0 if input is not a valid string
        }

        // Regular expression to match sentence-ending punctuation (., !, ?) 
        // while excluding common abbreviations like "Mr.", "Mrs.", "Dr.", titles, etc.
        const regex = /(?<!\b(Mr|Mrs|Ms|Dr|Prof|Sr|Jr|St|vs|etc)\.)(?<!\b[A-Z]\.)(?<=[.!?])\s+/g;

        // Split the paragraph based on the regex
        const sentences = paragraph.split(regex);

        // Filter out any empty strings caused by extra spaces or trailing punctuation
        const filteredSentences = sentences.filter(sentence => sentence?.trim().length > 0);

        return filteredSentences.length;
    }

    static countParagraphs(text: string): number {
        if (!text || text.trim() === '') {
            return 0;
        }

        // Split by one or more blank lines (two or more newlines)
        const paragraphs = text.split(/\n\s*\n/);

        // Filter out empty paragraphs
        const nonEmptyParagraphs = paragraphs.filter(p => p.trim() !== '');

        return nonEmptyParagraphs.length;
    }

    static findLongestWords(text: string, returnAll: boolean = false): string | string[] {
        if (!text || text.trim() === '') {
            return returnAll ? [] : '';
        }

        const words = text.trim().split(/\s+/);
        if (words.length === 0) {
            return returnAll ? [] : '';
        }

        // Find the maximum word length
        let maxLength = 0;
        for (const word of words) {
            if (word.length > maxLength) {
                maxLength = word.length;
            }
        }

        // Return all words with the maximum length if requested
        if (returnAll) {
            return words.filter(word => word.length === maxLength);
        }

        // Otherwise just return the first longest word
        return words.find(word => word.length === maxLength) || '';
    }

}