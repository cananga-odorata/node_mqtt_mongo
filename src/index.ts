import express, { Request, Response } from 'express';
import { config } from './config/env';
import healthRouter from './routes/index';
import pino from 'pino';

const logger = pino();
const app = express();

app.use(express.json());
app.use('/api', healthRouter);

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
        app.listen(config.PORT, () => {
            logger.info(`Environment: ${config.NODE_ENV} on Port: ${config.PORT}`);
        }).on('error', function (error: NodeJS.ErrnoException) {
                if (error.code === 'EADDRINUSE') {
                    logger.error(`Port ${config.PORT} is already in use`);
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