// src/routes/v1/index.ts
import express from 'express';
import heartbeatRouter from './heartbeat.route';
import statusRouter from './status.route';

const router = express.Router();

router.use('/heartbeat', heartbeatRouter);
router.use('/status', statusRouter);

export default router;