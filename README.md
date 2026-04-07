# Smart Q&A API

A Node.js/Express backend that uses a RAG (Retrieval-Augmented Generation) pipeline to answer questions based on your knowledge base. It retrieves relevant documents from MongoDB and uses Google Gemini to generate accurate, context-grounded responses.

## Quick Start

### Prerequisites
- Node.js 20+ or Docker
- MongoDB
- Google Gemini API key

### Installation

```bash
git clone <your-repo-url>
cd smart-qa-api
cp .env.example .env
npm install
npm run seed
npm run dev
```

### Docker

```bash
docker-compose up --build
docker-compose run --rm app npm run seed
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `PORT` | No | Server port (default: 3000) |

## How It Works

1. User asks a question
2. System searches MongoDB for relevant documents
3. Documents are injected into a prompt for Google Gemini
4. Gemini generates an answer based only on the provided context
5. Response includes answer, sources, and confidence level

## Project Structure

```
src/
  controllers/     # Request handlers
  middleware/      # Auth, error handling
  models/         # Database schemas
  routes/         # API routes
  services/       # Business logic
  app.js          # Express app
  server.js       # Server entry point
```

## Technology

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **LLM**: Google Gemini
- **Security**: bcryptjs
