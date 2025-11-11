import VehicleStatusModel from '../database/models/VehicleStatusLog';
import VehicleHeartbeatModel from '../database/models/VehicleHeartbeat';
import { IVehicleStatus, IVehicleHeartbeat, VehicleModelStatus } from '../interfaces/databaseInterfaces';

interface QueryParams {
    vehicleId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
}




export const getLatestVehicleModelStatusBulk = async (
    vehicleIds: string[],
    startDate?: string,
    endDate?: string
): Promise<VehicleModelStatus[]> => {
    const query: any = {
        vehicleId: { $in: vehicleIds },
        'rawData.model': { $exists: true, $ne: null }
    };

    if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const statuses = await VehicleStatusModel.find(query)
        .sort({ timestamp: -1 })
        .lean();

    // เอาแค่ latest ของแต่ละ vehicleId
    const latestMap: Record<string, any> = {};
    statuses.forEach((status: any) => {
        if (!latestMap[status.vehicleId]) {
            latestMap[status.vehicleId] = {
                vehicleId: status.vehicleId,
                timestamp: status.timestamp.toISOString(),
                status: status.rawData.status,
                model: status.rawData.model,
            };
        }
    });

    return Object.values(latestMap);
};



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

export const getLatestVehicleStatusWithModel = async (vehicleId: string): Promise<IVehicleStatus | null> => {
    try {
        const status = await VehicleStatusModel.findOne({
            vehicleId: vehicleId,
            'rawData.model': { $exists: true, $ne: null }
        })
            .sort({ timestamp: -1 })
            .lean();

        return status;
    } catch (error) {
        console.error('Error fetching latest vehicle status with model:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Failed to fetch latest vehicle status with model');
        } else {
            throw new Error('Failed to fetch latest vehicle status with model');
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
        const query: any = {
            'rawData.status': { $exists: true, $ne: null }
        };
        if (vehicleId) query.vehicleId = vehicleId;

        const status = await VehicleStatusModel.findOne(query)
            .sort({ timestamp: -1 })
            .lean();

        return status;
    } catch (error) {
        console.error('Error fetching latest vehicle status:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Failed to fetch latest vehicle status');
        } else {
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
        if (error instanceof Error) {
            throw new Error(error.message || 'Failed to fetch latest vehicle heartbeat');
        } else {
            throw new Error('Failed to fetch latest vehicle heartbeat');
        }
    }
};

export const getYearlyUsageByMonth = async (year: number, vehicleId?: string): Promise<any> => {
    try {
        const months = [];
        // Get usage for each month (1-12)
        for (let month = 1; month <= 12; month++) {
            const monthlyData = await getMonthlyUsage(year, month, vehicleId);
            months.push(monthlyData);
        }

        // Calculate total yearly usage
        const yearlyTotal = months.reduce((sum, month) => sum + month.monthlyUsage, 0);

        return {
            vehicleId: vehicleId,
            year,
            totalYearlyUsage: yearlyTotal,
            monthlyBreakdown: months
        };
    } catch (error) {
        console.error('Error calculating yearly usage:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Failed to calculate yearly usage');
        } else {
            throw new Error('Failed to calculate yearly usage');
        }
    }
};

export const getMonthlyUsage = async (year: number, month: number, vehicleId?: string): Promise<any> => {
    try {
        const startDate = new Date(year, month - 1, 1); // month is 0-based in JS Date
        const endDate = new Date(year, month, 0); // Get last day of the month

        const query: any = {
            timestamp: {
                $gte: startDate,
                $lte: endDate
            }
        };

        if (vehicleId) query.vehicleId = vehicleId;

        // Get the first and last records for the month
        const [firstRecord, lastRecord] = await Promise.all([
            VehicleHeartbeatModel.findOne({
                ...query,
                'rawData.total_usage_time': { $exists: true }
            })
                .sort({ timestamp: 1 }) // Earliest first
                .lean(),

            VehicleHeartbeatModel.findOne({
                ...query,
                'rawData.total_usage_time': { $exists: true }
            })
                .sort({ timestamp: -1 }) // Latest first
                .lean()
        ]);

        if (!firstRecord || !lastRecord ||
            !firstRecord.rawData.total_usage_time ||
            !lastRecord.rawData.total_usage_time) {
            return {
                vehicleId: vehicleId,
                year,
                month,
                monthlyUsage: 0,
                startDate: firstRecord?.timestamp || null,
                endDate: lastRecord?.timestamp || null,
                startUsage: firstRecord?.rawData.total_usage_time || null,
                endUsage: lastRecord?.rawData.total_usage_time || null
            };
        }

        const monthlyUsage = lastRecord.rawData.total_usage_time - firstRecord.rawData.total_usage_time;

        return {
            vehicleId: vehicleId,
            year,
            month,
            monthlyUsage: monthlyUsage > 0 ? monthlyUsage : 0,
            startDate: firstRecord.timestamp,
            endDate: lastRecord.timestamp,
            startUsage: firstRecord.rawData.total_usage_time,
            endUsage: lastRecord.rawData.total_usage_time
        };
    } catch (error) {
        console.error('Error calculating monthly usage:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Failed to calculate monthly usage');
        } else {
            throw new Error('Failed to calculate monthly usage');
        }
    }
};