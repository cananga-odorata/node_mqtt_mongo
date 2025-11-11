import express, { RequestHandler } from 'express';
import { getLatestVehicleStatus, getVehicleStatusDateRange, getLatestVehicleModel, getLatestVehicleModelStatusController } from '../../controllers/vehicleController';
import { postWrStatus } from '../../services/vehicleService';

const router = express.Router();

// Specific routes (must come before the parameterized '/:vehicle' route)
// GET /api/v1/status/latest
router.get('/latest', getLatestVehicleStatus as RequestHandler);
// GET /api/v1/status/latest/:vehicleId
router.get('/latest/:vehicleId', getLatestVehicleStatus as RequestHandler);
// GET /api/v1/status/latest-model/:vehicleId
router.get('/latest-model/:vehicleId', getLatestVehicleModel as RequestHandler);
// GET /api/v1/status/latest/:vehicleId/:endDate
router.get('/latest/:vehicleId/:endDate', getVehicleStatusDateRange as RequestHandler);

router.get('/latest-model-status', getLatestVehicleModelStatusController as RequestHandler);



// POST /api/v1/status/wrstatus
router.post('/wrstatus', postWrStatus);

export default router;