import express, { RequestHandler } from 'express';
import { 
    getVehicleHeartbeat, 
    getLatestVehicleHeartbeat, 
    getReportUsagePerMonth,
    getReportUsagePerYear
} from '../../controllers/vehicleController';

const router = express.Router();

// GET /api/v1/heartbeat/:vehicleId
router.get('/:vehicleId', getVehicleHeartbeat as RequestHandler);

// GET /api/v1/heartbeat/latest/:vehicleId
router.get('/latest/:vehicleId', getLatestVehicleHeartbeat as RequestHandler);

// GET /api/v1/heartbeat/reportUsagePerYear/:year
router.get('/reportUsagePerYear/:year', getReportUsagePerYear as RequestHandler);

// GET /api/v1/heartbeat/reportUsagePerYear/:year/:vehicleId
router.get('/reportUsagePerYear/:year/:vehicleId', getReportUsagePerYear as RequestHandler);

// GET /api/v1/heartbeat/reportUsagePerMonth/:year/:month
router.get('/reportUsagePerMonth/:year/:month', getReportUsagePerMonth as RequestHandler);

// GET /api/v1/heartbeat/reportUsagePerMonth/:year/:month/:vehicleId
router.get('/reportUsagePerMonth/:year/:month/:vehicleId', getReportUsagePerMonth as RequestHandler);

export default router;