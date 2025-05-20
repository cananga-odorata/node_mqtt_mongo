import express, { RequestHandler } from 'express';
import { getVehicleHeartbeat, getLatestVehicleHeartbeat } from '../../controllers/vehicleController';

const router = express.Router();

// GET /api/v1/heartbeat
router.get('/', getVehicleHeartbeat as RequestHandler);
// GET /api/v1/heartbeat/latest/:vehicleId?
router.get('/latest/:vehicleId', getLatestVehicleHeartbeat as RequestHandler);

export default router;