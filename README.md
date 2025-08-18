# Toyota Node.js + TypeScript API

A simple RESTful API built with Node.js, TypeScript, Express, and Pino logger. This project includes health check endpoints, environment-based configuration, MQTT integration, and error handling middleware.

## Features
- TypeScript support
- Express.js server
- Health check endpoint (`/api/health`)
- MQTT integration (publish/subscribe)
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
- `GET /api/v1/status` — Get all vehicle status
- `GET /api/v1/status/latest` — Get latest status for all vehicles
- `GET /api/v1/status/latest/:vehicleId` — Get latest status for a specific vehicle
- `GET /api/v1/vehicles/:vehicleId/data` — Get all status and heartbeat data for a specific vehicle.
- `POST /api/v1/status/wrstatus` — Publish a status and/or model to the MQTT topic `vehicle/{vehicleId}/wrstatus`.
  - **Body:** `{ "vehicleId": "string", "status": number, "model": number }` (At least one of `status` or `model` is required).
  - **Response:** `{ "success": true, "topic": "...", ...data }` (The response includes the `status` and/or `model` that was sent).

### Error Handling
- 404: Returns `{ error: 'Endpoint not found' }` for unknown endpoints
- 500: Returns `{ error: 'Internal Server Error' }` for unhandled errors

### Project Structure
```
src/
  app.ts               # Main server file
  config/env.ts        # Environment variable config
  config/mqtt.ts       # MQTT client setup
  routes/index.ts      # API routes (health check)
  routes/v1/status.route.ts # Vehicle status routes (GET/POST)
  controllers/vehicleController.ts # Vehicle status logic
  database/connectMongo.ts # MongoDB connection
```

### Linting & Formatting
```bash
npm run lint
```

## License
MIT
