# Text Analyzer

A utility for analyzing text including word count, character count, sentence analysis, and paragraph detection.

## Installation

Clone this repository and install dependencies:

```bash
git clone <repository-url>
cd textAnalyzer
npm install
```

## Usage

### 1. Local Development

Run the development server:

```bash
npm run dev
```

### 2. Run Tests

Execute the test suite:

```bash
npm test
```

## Features

The Text Analyzer provides several utilities to analyze text:

- **Word Count**: Count the number of words in a text
- **Character Count**: Count the number of characters (with or without whitespace)
- **Sentence Count**: Identify and count sentences in a text
- **Paragraph Count**: Count paragraphs separated by blank lines
- **Longest Words**: Find the longest word(s) in a text

## API Reference

### Endpoints

#### GET `/api/analyze`

Analyzes text and returns statistics.

**Parameters:**
- `text` (string, required): The text to analyze

**Response:**
```json
{
  "wordCount": 42,
  "characterCount": 240,
  "characterCountNoSpaces": 198,
  "sentenceCount": 5,
  "paragraphCount": 2,
  "longestWord": "extraordinary"
}
```

## Docker Support

You can run the application in a Docker container:

```bash
docker-compose up
```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request