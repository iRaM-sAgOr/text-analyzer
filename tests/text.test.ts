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