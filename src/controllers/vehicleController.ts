import { Request, Response } from 'express';
import { getVehicleStatuses, getVehicleHeartbeats, LatestVehicleHeartbeat, LatestVehicleStatus } from '../services/vehicleDataService';

export const getVehicleStatus = async (req: Request, res: Response) => {
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

        res.status(200).json({
            success: true,
            data: status,
            count: 1,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: (error instanceof Error ? error.message : 'Failed to fetch latest vehicle status'),
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