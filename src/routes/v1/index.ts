// src/routes/v1/index.ts
import express, { RequestHandler } from 'express';
import heartbeatRouter from './heartbeat.route';
import statusRouter from './status.route';
import { getAllStatusesByVehicleId } from '../../controllers/vehicleController';

const router = express.Router();

router.use('/heartbeat', heartbeatRouter);
router.use('/status', statusRouter);
router.get('/statusAndHeartbeat/:vehicleId', getAllStatusesByVehicleId as RequestHandler);

export default router;