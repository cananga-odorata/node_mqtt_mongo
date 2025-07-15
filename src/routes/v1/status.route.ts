import express, { RequestHandler } from 'express';
import { getVehicleStatus, getLatestVehicleStatus } from '../../controllers/vehicleController';
import { postWrStatus } from '../../services/vehicleService';

const router = express.Router();

// GET /api/v1/status
router.get('/', getVehicleStatus as RequestHandler);
// GET /api/v1/status/latest
router.get('/latest', getLatestVehicleStatus as RequestHandler);
// GET /api/v1/status/latest/:vehicleId
router.get('/latest/:vehicleId', getLatestVehicleStatus as RequestHandler);

// POST /api/v1/status/wrstatus
router.post('/wrstatus', postWrStatus);

export default router;