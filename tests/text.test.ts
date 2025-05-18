import { TextAnalyzer } from '../src/utils/text.analyzer';

describe('TextAnalyzer Count Word Function', () => {
    // Using test.each for parameterized testing
    test.each([
        // [testName, input, expectedOutput]
        ['normal sentence', 'The quick brown fox jumps over the lazy dog. The lazy dog slept in the sun.', 16],
        ['empty string', '', 0],
        ['whitespace only', '     ', 0],
        ['single word', 'Hello', 1],
        ['multiple spaces', 'This   has    multiple    spaces', 4],
        ['newlines and tabs', 'Line1\nLine2\tLine3', 3],
        ['punctuation without spaces', 'Hello,world!How are you?', 3],
        ['single letters', 'A B C D E F', 6],
        ['mixed case', 'ThIs Is MiXeD cAsE tExT', 5],
        ['simple phrase', 'Hello world from TypeScript', 4],
        ['common phrase', 'The quick brown fox jumps over the lazy dog', 9],
        ['with multiple spaces and punctuation', '  This is   a test.  ', 4],
        ['punctuation without spaces 2', 'Hello.World.Test', 1],
    ])('%s: countWords("%s") should be %i', (_, text, expected) => {
        expect(TextAnalyzer.countWords(text)).toBe(expected);
    });
});

describe('TextAnalyzer Count Characters Function', () => {
    describe('With whitespace included (default behavior)', () => {
        test.each([
            // [testName, input, expectedOutput]
            ['simple text', 'Hello, world!', 13],
            ['text with spaces', 'The quick brown fox.', 20],
            ['empty string', '', 0],
            ['only whitespace', '     ', 5],
            ['single character', 'a', 1],
            ['mixed whitespace', 'Line1\nLine2\tLine3', 17],
            ['only numbers', '123456789', 9],
            ['multiple spaces', '   Trailing   spaces   ', 23],
        ])('%s: countCharacters("%s") should be %i', (_, text, expected) => {
            expect(TextAnalyzer.countCharacters(text, true)).toBe(expected);
        });
    });

    describe('With whitespace excluded', () => {
        test.each([
            // [testName, input, expectedOutput]
            ['simple text', 'Hello, world!', 12],
            ['text with spaces', 'The quick brown fox.', 17],
            ['empty string', '', 0],
            ['only whitespace', '     ', 0],
            ['single character', 'a', 1],
            ['mixed whitespace', 'Line1\nLine2\tLine3', 15],
            ['only numbers', '123456789', 9],
            ['multiple spaces', '   Trailing   spaces   ', 14],
        ])('%s: countCharacters("%s", false) should be %i', (_, text, expected) => {
            expect(TextAnalyzer.countCharacters(text)).toBe(expected);
        });
    });
});

describe('TextAnalyzer Count Sentences Function', () => {
    test.each([
        // Normal cases
        ['multiple sentences', 'Hello world. This is a test! Is it working?', 3],
        ['single sentence', 'This is one sentence.', 1],

        // Edge cases
        ['empty string', '', 0],
        ['whitespace only', '     ', 0],
        ['no punctuation', 'No punctuation', 1],

        // Corner cases
        ['ellipsis', 'Hello world...', 1],
        ['multiple punctuation', 'Hello!!! World... Testing???', 3],
        ['multiple delimiters', 'Hello. . . world', 4],
        ['no spaces', 'Hello.World.Test', 1],
        ['abbreviations', 'Mr. Smith went to Washington, D.C. yesterday.', 1],
        ['mixed delimiters', 'First. Second! Third? Fourth.', 4],
        ['sequential', 'First.Second.Third', 1],
        ['single word with period', 'Sentence.', 1],
        ['single word with ellipsis', 'Sentence...', 1],
    ])('%s: countSentences("%s") should be %i', (_, text, expected) => {
        expect(TextAnalyzer.countSentences(text)).toBe(expected);
    });
});

describe('TextAnalyzer Count Paragraphs Function', () => {
    test.each([
        // Normal cases
        ['two paragraphs', 'First paragraph.\n\nSecond paragraph.', 2],
        ['single paragraph', 'Single paragraph without breaks.', 1],

        // Edge cases
        ['empty string', '', 0],
        ['whitespace only', '     ', 0],
        ['only newlines', '\n\n\n', 0],

        // Corner cases
        ['three paragraphs with blank lines', 'Para 1.\n\nPara 2.\n\n\nPara 3.', 3],
        ['whitespace between newlines', 'Para 1.\n \nPara 2.', 2],
        ['multiple blank lines', 'Para 1.\n\n\n\nPara 2.', 2],
        ['different newline characters', 'Para 1.\r\n\r\nPara 2.', 2],
        ['paragraphs with whitespace', 'Para1\n\n\n    Para2   \n\nPara3', 3],
        ['ignoring leading/trailing blank lines', '  \n  \n  Para1  \n  \n  ', 1],
    ])('%s: countParagraphs("%s") should be %i', (_, text, expected) => {
        expect(TextAnalyzer.countParagraphs(text)).toBe(expected);
    });
});

describe('TextAnalyzer Find Longest Words Function', () => {
    describe('With default returnAll=false', () => {
        test.each([
            // Normal cases
            ['standard sentence', 'The quick brown fox jumped over the lazy dog', 'jumped'],

            // Edge cases
            ['empty string', '', ''],
            ['whitespace only', '     ', ''],
            ['single word', 'word', 'word'],

            // Corner cases
            ['tied longest words', 'apple banana cherry', 'banana'], // It returns the first longest word
            ['very long word', 'antidisestablishmentarianism is a long word', 'antidisestablishmentarianism'],
            ['duplicate words', 'hello hello hello', 'hello'],
            ['with punctuation', 'punctuation! is, considered; part-of-words', 'part-of-words'],
            ['increasing lengths', 'a bb ccc dddd eeeee', 'eeeee']
        ])('%s: findLongestWords("%s") should be "%s"', (_, text, expected) => {
            expect(TextAnalyzer.findLongestWords(text)).toBe(expected);
        });
    });

    describe('With returnAll=true', () => {
        test.each([
            // Normal cases
            ['standard sentence', 'The quick brown fox jumped over the lazy dog', ['jumped']],

            // Edge cases
            ['empty string', '', []],
            ['whitespace only', '     ', []],
            ['single word', 'word', ['word']],

            // Corner cases
            ['tied longest words', 'apple banana cherry', ['banana', 'cherry']], // Both banana and cherry are 6 letters
            ['very long word', 'antidisestablishmentarianism is a long word', ['antidisestablishmentarianism']],
            ['duplicate words', 'hello hello hello', ['hello', 'hello', 'hello']],
            ['with punctuation', 'punctuation! is, considered; part-of-words', ['part-of-words']],
            ['increasing lengths', 'a bb ccc dddd eeeee', ['eeeee']],
            ['long single word', 'supercalifragilisticexpialidocious', ['supercalifragilisticexpialidocious']]
        ])('%s: findLongestWords("%s", true) should be %j', (_, text, expected) => {
            const result = TextAnalyzer.findLongestWords(text, true) as string[];
            expect(result).toEqual(expect.arrayContaining(expected));
            expect(result.length).toBe(expected.length);
        });
    });
});