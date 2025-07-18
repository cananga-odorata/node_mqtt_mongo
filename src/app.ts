import express, { Request, Response } from 'express';
import { configEnv } from './config/env';
import pino from 'pino';
import apiRouter from './routes';
import connectMongo from './database/connectMongo';
import { client } from './config/mqtt';
import { setupMqtt } from './services/mqttService';

const logger = pino();
const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the Node.js + TypeScript API!' });
});

// Error handling for unknown endpoints
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
    logger.error(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

async function startServer() {
    try {
        await setupMqtt();
        await connectMongo();
        client.on('connect', () => {
            logger.info('Connected to MQTT Broker');
        });
        app.listen(configEnv.PORT, () => {
            logger.info(`Environment: ${configEnv.NODE_ENV} on Port: ${configEnv.PORT}`);
        }).on('error', function (error: NodeJS.ErrnoException) {
            if (error.code === 'EADDRINUSE') {
                logger.error(`Port ${configEnv.PORT} is already in use`);
            } else {
                logger.error('Server error:', error);
            }
            process.exit(1);
        });
    } catch (error) {
        logger.error('Failed to Start Server:', error);
        process.exit(1);
    }
}

startServer();