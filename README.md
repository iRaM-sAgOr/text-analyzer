# Text Analyzer

A utility for analyzing text including word count, character count, sentence analysis, and paragraph detection.

## Prerequisites

- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed on your machine.

## Setup & Running with Docker

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd textAnalyzer
   ```

2. **Start the application and all dependencies using Docker Compose:**
   ```bash
   docker-compose up -d
   ```

   This command will start:
   - The Text Analyzer application (Node.js)
   - MongoDB (database)
   - Redis (cache)
   - Loki, Promtail, Grafana (for logging/monitoring)
   - Keycloak and Postgres (for authentication)

3. **Access the API:**
   - The API will be available at: [http://localhost:3000](http://localhost:3000)

4. **Stopping the application:**
   ```bash
   docker-compose down
   ```

## API Usage

All endpoints require a `userId` parameter:
- For GET/DELETE: as a query parameter (`?userId=your-user-id`)
- For POST/PUT: in the JSON body (`{ "userId": "your-user-id" }`)

### Example API Calls

#### Create a new text
```bash
curl -X POST http://localhost:3000/api/texts \
  -H "Content-Type: application/json" \
  -d '{"content": "The quick brown fox jumps over the lazy dog.", "userId": "your-user-id"}'
```

#### Get word count
```bash
curl "http://localhost:3000/api/texts/<textId>/word-count?userId=your-user-id"
```

#### Update text
```bash
curl -X PUT http://localhost:3000/api/texts/<textId> \
  -H "Content-Type: application/json" \
  -d '{"content": "Updated content.", "userId": "your-user-id"}'
```

#### Delete text
```bash
curl -X DELETE "http://localhost:3000/api/texts/<textId>?userId=your-user-id"
```

### Swagger Link
```bash
http://localhost:3000/analyzer/api-docs/

## Features

- **Word Count**: Count the number of words in a text
- **Character Count**: Count the number of characters (with or without whitespace)
- **Sentence Count**: Identify and count sentences in a text
- **Paragraph Count**: Count paragraphs separated by blank lines
- **Longest Words**: Find the longest word(s) in a text

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request