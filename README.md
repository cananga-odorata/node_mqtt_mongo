# Toyota Node.js + TypeScript API

A simple RESTful API built with Node.js, TypeScript, Express, and Pino logger. This project includes health check endpoints, environment-based configuration, and error handling middleware.

## Features
- TypeScript support
- Express.js server
- Health check endpoint (`/api/health`)
- Environment variable management with dotenv
- Centralized error handling (404 and 500)
- Logging with Pino
- ESLint and Prettier integration

## Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm

### Installation
```bash
npm install
```

### Running the Server
#### Development
```bash
npm run dev
```

#### Production
```bash
npm run build
npm start
```

### API Endpoints
- `GET /api/health` — Health check endpoint
- `GET /` — Welcome message

### Error Handling
- 404: Returns `{ error: 'Endpoint not found' }` for unknown endpoints
- 500: Returns `{ error: 'Internal Server Error' }` for unhandled errors

### Project Structure
```
src/
  index.ts           # Main server file
  config/env.ts      # Environment variable config
  routes/index.ts    # API routes (health check)
```

### Linting & Formatting
```bash
npm run lint
```

## License
MIT
