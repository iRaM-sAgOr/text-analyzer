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

}