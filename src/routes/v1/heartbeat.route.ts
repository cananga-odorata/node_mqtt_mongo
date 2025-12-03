import express, { RequestHandler } from 'express';
import {
    getVehicleHeartbeat,
    getLatestVehicleHeartbeat,
    getReportUsagePerMonth,
    getReportUsagePerYear,
    getLatestVehicleHeartbeatBulkController,
    getDailyUsagePerVehicleBulkController,
    getUsageTimeSeriesForGraphController,
    getUsageTimeSeriesForGraphBulkController
} from '../../controllers/vehicleController';

const router = express.Router();

// GET /api/v1/heartbeat/usage-time-series?vehicleIds=...&startDateTime=...&endDateTime=...
// GET /api/v1/heartbeat/usage-time-series-bulk?vehicleIds=...&startDateTime=...&endDateTime=...&page=1&limit=100&interval=all
router.get('/usage-time-series-bulk', getUsageTimeSeriesForGraphBulkController as RequestHandler);

router.get('/usage-time-series', getUsageTimeSeriesForGraphController as RequestHandler);

// GET /api/v1/heartbeat/daily-usage-bulk?vehicleIds=...&date=YYYY-MM-DD
router.get('/daily-usage-bulk', getDailyUsagePerVehicleBulkController as RequestHandler);

// GET /api/v1/heartbeat/latest-bulk
router.get('/latest-bulk', getLatestVehicleHeartbeatBulkController as RequestHandler);

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

// Generic vehicleId route should be last so it doesn't capture other paths
// GET /api/v1/heartbeat/:vehicleId
router.get('/:vehicleId', getVehicleHeartbeat as RequestHandler);

export default router;
