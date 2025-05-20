import VehicleStatusModel from '../database/models/VehicleStatusLog';
import VehicleHeartbeatModel from '../database/models/VehicleHeartbeat';
import { IVehicleStatus, IVehicleHeartbeat } from '../interfaces/databaseInterfaces';

interface QueryParams {
    vehicleId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
}

export const getVehicleStatuses = async (params: QueryParams = {}): Promise<IVehicleStatus[]> => {
    try {
        const { vehicleId, startDate, endDate, limit = 100 } = params;
        const query: any = {};

        if (vehicleId) query.vehicleId = vehicleId;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) {
                if (isNaN(startDate.getTime())) throw new Error('Invalid startDate');
                query.timestamp.$gte = startDate;
            }
            if (endDate) {
                if (isNaN(endDate.getTime())) throw new Error('Invalid endDate');
                query.timestamp.$lte = endDate;
            }
        }

        const statuses = await VehicleStatusModel.find(query)
            .sort({ timestamp: -1 }) // ล่าสุดก่อน
            .limit(limit)
            .lean();

        return statuses;
    } catch (error) {
        console.error('Error fetching vehicle statuses:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Failed to fetch vehicle statuses');
        } else {
            throw new Error('Failed to fetch vehicle statuses');
        }
    }
};

export const getVehicleHeartbeats = async (params: QueryParams = {}): Promise<IVehicleHeartbeat[]> => {
    try {
        const { vehicleId, startDate, endDate, limit = 100 } = params;
        const query: any = {};

        if (vehicleId) query.vehicleId = vehicleId;
        if (startDate || endDate) {
            query.timestamp = {};
            if (startDate) {
                if (isNaN(startDate.getTime())) throw new Error('Invalid startDate');
                query.timestamp.$gte = startDate;
            }
            if (endDate) {
                if (isNaN(endDate.getTime())) throw new Error('Invalid endDate');
                query.timestamp.$lte = endDate;
            }
        }

        const heartbeats = await VehicleHeartbeatModel.find(query)
            .sort({ timestamp: -1 }) // ล่าสุดก่อน
            .limit(limit)
            .lean();

        return heartbeats;
    } catch (error) {
        console.error('Error fetching vehicle heartbeats:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Failed to fetch vehicle heartbeats');
        } else {
            throw new Error('Failed to fetch vehicle heartbeats');
        }
    }
};

export const LatestVehicleStatus = async (vehicleId?: string): Promise<IVehicleStatus | null> => {
    try {
        const query: any = {};
        if (vehicleId) query.vehicleId = vehicleId;

        const status = await VehicleStatusModel.findOne(query)
            .sort({ timestamp: -1 })
            .lean();

        return status;
    } catch (error) {
        console.error('Error fetching latest vehicle status:', error);
        if(error instanceof Error){
            throw new Error(error.message || 'Failed to fetch latest vehicle status');
        }else{
            throw new Error('Failed to fetch latest vehicle statud');
        }
    }
};

export const LatestVehicleHeartbeat = async (vehicleId?: string): Promise<IVehicleHeartbeat | null> => {
    try {
        const query: any = {};
        if (vehicleId) query.vehicleId = vehicleId;

        const heartbeat = await VehicleHeartbeatModel.findOne(query)
            .sort({ timestamp: -1 })
            .lean();

        return heartbeat;
    } catch (error) {
        console.error('Error fetching latest vehicle heartbeat:', error);
        if(error instanceof Error){
            throw new Error(error.message || 'Failed to fetch latest vehicle heartbeat');
        }else{
            throw new Error('Failed to fetch latest vehicle heartbeat');
        }
    }
};