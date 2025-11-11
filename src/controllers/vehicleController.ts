import { Request, Response } from 'express';
import {
    getVehicleStatuses,
    getVehicleHeartbeats,
    LatestVehicleHeartbeat,
    LatestVehicleStatus,
    getLatestVehicleStatusWithModel,
    getMonthlyUsage,
    getYearlyUsageByMonth,
    getLatestVehicleModelStatusBulk
} from '../services/vehicleDataService';


export const getLatestVehicleModelStatusController = async (req: Request, res: Response) => {
    try {
        const { vehicleId, startDate, endDate } = req.query;

        if (!vehicleId) {
            return res.status(400).json({ error: 'Missing vehicleId in query' });
        }

        const vehicleIds = typeof vehicleId === 'string'
            ? vehicleId.split(',').map(id => id.trim())
            : Array.isArray(vehicleId)
                ? vehicleId.map(id => String(id).trim())
                : [];

        const results = await getLatestVehicleModelStatusBulk(vehicleIds, startDate as string | undefined, endDate as string | undefined);

        res.json({
            success: true,
            data: results,
            count: results.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getVehicleStatus = async (req: Request, res: Response) => {
    try {
        const { vehicleId, startDate, endDate } = req.query;

        const params: any = {};
        if (vehicleId) params.vehicleId = vehicleId as string;
        if (startDate) params.startDate = new Date(startDate as string);
        if (endDate) params.endDate = new Date(endDate as string);

        const statuses = await getVehicleStatuses({ ...params, limit: 100 });
        res.status(200).json({
            success: true,
            data: statuses,
            count: statuses.length,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error instanceof Error ? error.message : 'Failed to fetch vehicle statuses'),
        });
    }
};

export const getVehicleHeartbeat = async (req: Request, res: Response) => {
    try {
        const { vehicleId, startDate, endDate } = req.params;

        const params: any = {};
        if (vehicleId) params.vehicleId = vehicleId;
        if (startDate) params.startDate = new Date(startDate);
        if (endDate) params.endDate = new Date(endDate);

        const heartbeats = await getVehicleHeartbeats(params);
        res.status(200).json({
            success: true,
            data: heartbeats,
            count: heartbeats.length,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error instanceof Error ? error.message : 'Failed to fetch vehicle statuses'),
        });
    }
};


export const getLatestVehicleStatus = async (req: Request, res: Response) => {
    try {
        const vehicleId = req.params.vehicleId || (req.query.vehicleId as string | undefined);

        const status = await LatestVehicleStatus(vehicleId);
        if (!status) {
            return res.status(404).json({
                success: false,
                message: `No status found for vehicle ${vehicleId || 'any vehicle'}`,
            });
        }
        const responseData = {
            vehicleId: status.vehicleId,
            timestamp: status.timestamp,
            status: status.rawData.status
        };

        res.status(200).json({
            success: true,
            data: responseData,
            count: 1,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error instanceof Error ? error.message : 'Failed to fetch latest vehicle status'),
        });
    }
};

export const getReposrtUsagePerYear = async (req: Request, res: Response) => {
    try {
        const { year, vehicleId } = req.params;
        if (!year || isNaN(Number(year))) {
            return res.status(400).json({
                success: false,
                message: 'Year parameter is required and must be a valid number.',
            });
        }
        const startDate = new Date(Number(year), 0, 1);
        const endDate = new Date(Number(year) + 1, 0, 1);

        const params: any = {
            startDate,
            endDate
        };

        if (vehicleId) params.vehicleId = vehicleId;

        const statuses = await getVehicleHeartbeats(params);

        res.status(200).json({
            success: true,
            data: statuses,
            count: statuses.length,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error instanceof Error ? error.message : 'Failed to fetch vehicle statuses'),
        });
    }
};

export const getReportUsagePerYear = async (req: Request, res: Response) => {
    try {
        const { year, vehicleId } = req.params;

        if (!year || isNaN(Number(year))) {
            return res.status(400).json({
                success: false,
                message: 'Year parameter is required and must be a valid number.',
            });
        }

        const yearlyUsage = await getYearlyUsageByMonth(Number(year), vehicleId);
        res.status(200).json({
            success: true,
            data: yearlyUsage
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error instanceof Error ? error.message : 'Failed to fetch yearly usage'),
        });
    }
};

export const getReportUsagePerMonth = async (req: Request, res: Response) => {
    try {
        const { year, month, vehicleId } = req.params;

        if (!year || isNaN(Number(year))) {
            return res.status(400).json({
                success: false,
                message: 'Year parameter is required and must be a valid number.',
            });
        }

        if (!month || isNaN(Number(month)) || Number(month) < 1 || Number(month) > 12) {
            return res.status(400).json({
                success: false,
                message: 'Month parameter is required and must be a valid number between 1 and 12.',
            });
        }

        const usage = await getMonthlyUsage(Number(year), Number(month), vehicleId);
        res.status(200).json({
            success: true,
            data: usage
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error instanceof Error ? error.message : 'Failed to fetch monthly usage'),
        });
    }
};

export const getLatestVehicleHeartbeat = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;

        const heartbeat = await LatestVehicleHeartbeat(vehicleId);
        if (!heartbeat) {
            return res.status(404).json({
                success: false,
                message: `No heartbeat found for vehicle ${vehicleId || 'any vehicle'}`,
            });
        }

        res.status(200).json({
            success: true,
            data: heartbeat,
            count: 1,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error instanceof Error ? error.message : 'Failed to fetch latest vehicle heartbeat'),
        });
    }
};

export const getLatestVehicleModel = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;
        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: 'Vehicle ID is required.',
            });
        }

        const status = await getLatestVehicleStatusWithModel(vehicleId);
        if (!status) {
            return res.status(404).json({
                success: false,
                message: `No status with a model found for vehicle ${vehicleId}`,
            });
        }

        res.status(200).json({
            success: true,
            data: {
                vehicleId: status.vehicleId,
                model: status.rawData.model,
                timestamp: status.timestamp,
            },
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error instanceof Error ? error.message : 'Failed to fetch latest vehicle model'),
        });
    }
};

export const getVehicleStatusDateRange = async (req: Request, res: Response) => {
    try {
        const { vehicleId, startDate, endDate } = req.params;

        const params: any = {};
        if (vehicleId) params.vehicleId = vehicleId;
        if (startDate) params.startDate = new Date(startDate);
        if (endDate) params.endDate = new Date(endDate);

        const statuses = await getVehicleStatuses(params);
        res.status(200).json({
            success: true,
            data: statuses,
            count: statuses.length,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error instanceof Error ? error.message : 'Failed to fetch vehicle statuses'),
        });
    }
}
export const getAllStatusesByVehicleId = async (req: Request, res: Response) => {
    try {
        const { vehicleId } = req.params;
        if (!vehicleId) {
            return res.status(400).json({
                success: false,
                message: 'Vehicle ID is required in the URL path.',
            });
        }

        const statuses = await getVehicleStatuses({ vehicleId });
        const heartbeats = await getVehicleHeartbeats({ vehicleId });

        res.status(200).json({
            success: true,
            data: { statuses, heartbeats },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: (error instanceof Error ? error.message : 'Failed to fetch vehicle data'),
        });
    }
};