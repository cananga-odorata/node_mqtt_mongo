import VehicleStatusModel from '../database/models/VehicleStatusLog';
import VehicleHeartbeatModel from '../database/models/VehicleHeartbeat';
import { IVehicleStatus, IVehicleHeartbeat, VehicleModelStatus } from '../interfaces/databaseInterfaces';

interface QueryParams {
    vehicleId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
}


export const getLatestVehicleHeartbeatBulk = async (
    vehicleIds: string[],
    startDateTime?: string,
    endDateTime?: string
): Promise<IVehicleHeartbeat[]> => {

    // กำหนด default เป็นเดือนปัจจุบันถ้าไม่ได้ส่ง startDateTime / endDateTime
    const now = new Date();
    const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1); // วันที่ 1 ของเดือนนี้
    const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // สิ้นเดือน

    let dateStart = defaultStart;
    let dateEnd = defaultEnd;

    // Parse startDateTime และ endDateTime (ISO 8601 format: 2025-12-02T08:00:00 หรือ 2025-12-02 08:00)
    if (startDateTime) {
        dateStart = new Date(startDateTime);
        if (isNaN(dateStart.getTime())) {
            throw new Error(`Invalid startDateTime format: ${startDateTime}. Use ISO 8601 format (e.g., 2025-12-02T08:00:00)`);
        }
    }
    if (endDateTime) {
        dateEnd = new Date(endDateTime);
        if (isNaN(dateEnd.getTime())) {
            throw new Error(`Invalid endDateTime format: ${endDateTime}. Use ISO 8601 format (e.g., 2025-12-02T17:00:00)`);
        }
    }

    const match: any = {
        vehicleId: { $in: vehicleIds },
        timestamp: { $exists: true, $ne: null }
    };

    match.timestamp = {
        $gte: dateStart,
        $lte: dateEnd
    };

    console.log('vehicleIdArray:', vehicleIds);
    console.log('match query:', match);
    console.log(`DateTime range: ${dateStart.toISOString()} - ${dateEnd.toISOString()}`);

    const latestHeartbeats = await VehicleHeartbeatModel.aggregate([
        { $match: match },
        { $sort: { vehicleId: 1, timestamp: -1 } }, // sort ใหม่สุดไปเก่าสุด
        {
            $group: {
                _id: '$vehicleId',
                latest: { $first: '$$ROOT' } // เอา record ใหม่สุดต่อ vehicle
            }
        },
        { $replaceRoot: { newRoot: '$latest' } } // flatten
    ]).allowDiskUse(false).exec();

    return latestHeartbeats;
};





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

export const getDailyUsagePerVehicleBulk = async (
    vehicleIds: string[],
    date: string // YYYY-MM-DD format
): Promise<any[]> => {
    try {
        const dateObj = new Date(date);
        if (isNaN(dateObj.getTime())) {
            throw new Error(`Invalid date format: ${date}. Use YYYY-MM-DD`);
        }

        const startDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 0, 0, 0, 0);
        const endDate = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), 23, 59, 59, 999);

        const query: any = {
            vehicleId: { $in: vehicleIds },
            timestamp: {
                $gte: startDate,
                $lte: endDate
            },
            'rawData.total_usage_time': { $exists: true }
        };

        // Get first and last records for each vehicle on that day
        const latestHeartbeats = await VehicleHeartbeatModel.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$vehicleId',
                    firstRecord: { $first: '$$ROOT' },
                    lastRecord: { $last: '$$ROOT' }
                }
            },
            {
                $project: {
                    vehicleId: '$_id',
                    date: dateObj.toISOString().split('T')[0],
                    dailyUsage: {
                        $subtract: [
                            '$lastRecord.rawData.total_usage_time',
                            '$firstRecord.rawData.total_usage_time'
                        ]
                    },
                    startTime: '$firstRecord.timestamp',
                    endTime: '$lastRecord.timestamp',
                    startUsage: '$firstRecord.rawData.total_usage_time',
                    endUsage: '$lastRecord.rawData.total_usage_time',
                    recordCount: { $sum: 1 }
                }
            },
            { $sort: { vehicleId: 1 } }
        ]).exec();

        // Add missing vehicles with 0 usage
        const vehicleMap = new Map(latestHeartbeats.map(v => [v.vehicleId, v]));
        const result = vehicleIds.map(vid => {
            if (vehicleMap.has(vid)) {
                return vehicleMap.get(vid);
            }
            return {
                vehicleId: vid,
                date: dateObj.toISOString().split('T')[0],
                dailyUsage: 0,
                startTime: null,
                endTime: null,
                startUsage: null,
                endUsage: null,
                recordCount: 0
            };
        });

        return result;
    } catch (error) {
        console.error('Error calculating daily usage:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Failed to calculate daily usage');
        } else {
            throw new Error('Failed to calculate daily usage');
        }
    }
};
export const getUsageTimeSeriesForGraph = async (
    vehicleIds: string[],
    startDateTime?: string,
    endDateTime?: string
): Promise<any> => {
    try {
        // Parse datetime or use default (current month)
        const now = new Date();
        const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        let dateStart = defaultStart;
        let dateEnd = defaultEnd;

        if (startDateTime) {
            dateStart = new Date(startDateTime);
            if (isNaN(dateStart.getTime())) {
                throw new Error(`Invalid startDateTime format: ${startDateTime}`);
            }
        }
        if (endDateTime) {
            dateEnd = new Date(endDateTime);
            if (isNaN(dateEnd.getTime())) {
                throw new Error(`Invalid endDateTime format: ${endDateTime}`);
            }
        }

        const query: any = {
            vehicleId: { $in: vehicleIds },
            timestamp: {
                $gte: dateStart,
                $lte: dateEnd
            },
            'rawData.total_usage_time': { $exists: true, $ne: null }
        };

        // Fetch all records and sort by timestamp
        const records = await VehicleHeartbeatModel.find(query)
            .select('vehicleId timestamp rawData.total_usage_time')
            .sort({ vehicleId: 1, timestamp: 1 })
            .lean()
            .exec();

        // Group by vehicleId and create time-series data
        const seriesMap: Record<string, any[]> = {};

        vehicleIds.forEach(vid => {
            seriesMap[vid] = [];
        });

        // Process records for each vehicle
        records.forEach((record: any) => {
            if (seriesMap[record.vehicleId]) {
                seriesMap[record.vehicleId].push({
                    timestamp: record.timestamp,
                    usage: record.rawData.total_usage_time,
                    date: record.timestamp.toISOString()
                });
            }
        });

        // Calculate cumulative usage and format for graph
        const graphData: Record<string, any[]> = {};

        Object.entries(seriesMap).forEach(([vehicleId, points]) => {
            graphData[vehicleId] = points.map((point, index) => {
                const previousUsage = index > 0 ? points[index - 1].usage : point.usage;
                const usageDelta = point.usage - previousUsage;

                return {
                    timestamp: point.date,
                    totalUsage: point.usage,
                    usageDelta: usageDelta >= 0 ? usageDelta : 0,
                    recordIndex: index + 1
                };
            });
        });

        return {
            period: {
                start: dateStart.toISOString(),
                end: dateEnd.toISOString()
            },
            vehicles: Object.keys(graphData).map(vid => ({
                vehicleId: vid,
                records: graphData[vid],
                totalRecords: graphData[vid].length,
                startUsage: graphData[vid][0]?.totalUsage || 0,
                endUsage: graphData[vid][graphData[vid].length - 1]?.totalUsage || 0,
                totalUsageDelta: (graphData[vid][graphData[vid].length - 1]?.totalUsage || 0) - (graphData[vid][0]?.totalUsage || 0)
            }))
        };
    } catch (error) {
        console.error('Error fetching usage time series:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Failed to fetch usage time series');
        } else {
            throw new Error('Failed to fetch usage time series');
        }
    }
};

export const getUsageTimeSeriesForGraphBulk = async (
    vehicleConfigs: Array<{ vehicleId: string; startDateTime?: string; endDateTime?: string }>,
    page: number = 1,
    limit: number = 100,
    interval?: 'all' | 'hourly' | 'daily' // 'all' returns all records, 'hourly'/'daily' aggregates
): Promise<any> => {
    try {
        const pageNum = Math.max(1, page);
        const limitNum = Math.min(Math.max(1, limit), 1000); // Max 1000 records per response
        const skip = (pageNum - 1) * limitNum;

        const bulkData: any[] = [];
        let totalRecords = 0;

        // Process each vehicle configuration
        for (const config of vehicleConfigs) {
            const now = new Date();
            const defaultStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const defaultEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

            let dateStart = defaultStart;
            let dateEnd = defaultEnd;

            if (config.startDateTime) {
                dateStart = new Date(config.startDateTime);
                if (isNaN(dateStart.getTime())) {
                    throw new Error(`Invalid startDateTime for ${config.vehicleId}: ${config.startDateTime}`);
                }
            }
            if (config.endDateTime) {
                dateEnd = new Date(config.endDateTime);
                if (isNaN(dateEnd.getTime())) {
                    throw new Error(`Invalid endDateTime for ${config.vehicleId}: ${config.endDateTime}`);
                }
            }

            const query: any = {
                vehicleId: config.vehicleId,
                timestamp: {
                    $gte: dateStart,
                    $lte: dateEnd
                },
                'rawData.total_usage_time': { $exists: true, $ne: null }
            };

            // Get total count for pagination
            const totalCount = await VehicleHeartbeatModel.countDocuments(query);
            totalRecords = Math.max(totalRecords, totalCount);

            // Fetch paginated records
            const records = await VehicleHeartbeatModel.find(query)
                .select('vehicleId timestamp rawData.total_usage_time')
                .sort({ timestamp: 1 })
                .skip(skip)
                .limit(limitNum)
                .lean()
                .exec();

            // Apply interval aggregation if specified
            let processedRecords = records.map((record: any, index: number) => {
                const previousUsage = index > 0 ? records[index - 1].rawData.total_usage_time : record.rawData.total_usage_time;
                const usageDelta = record.rawData.total_usage_time - previousUsage;

                return {
                    timestamp: record.timestamp.toISOString(),
                    totalUsage: record.rawData.total_usage_time,
                    usageDelta: usageDelta >= 0 ? usageDelta : 0
                };
            });

            if (interval === 'hourly') {
                processedRecords = aggregateRecordsByInterval(processedRecords, 'hourly');
            } else if (interval === 'daily') {
                processedRecords = aggregateRecordsByInterval(processedRecords, 'daily');
            }

            bulkData.push({
                vehicleId: config.vehicleId,
                period: {
                    start: dateStart.toISOString(),
                    end: dateEnd.toISOString()
                },
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / limitNum)
                },
                interval: interval || 'all',
                records: processedRecords,
                recordCount: processedRecords.length
            });
        }

        return {
            success: true,
            vehicles: bulkData,
            metadata: {
                requestedVehicles: vehicleConfigs.length,
                returnedVehicles: bulkData.length,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(totalRecords / limitNum)
                }
            }
        };
    } catch (error) {
        console.error('Error fetching bulk usage time series:', error);
        if (error instanceof Error) {
            throw new Error(error.message || 'Failed to fetch bulk usage time series');
        } else {
            throw new Error('Failed to fetch bulk usage time series');
        }
    }
};

// Helper function to aggregate records by time interval
const aggregateRecordsByInterval = (records: any[], interval: 'hourly' | 'daily'): any[] => {
    if (records.length === 0) return [];

    const aggregated: any[] = [];
    let currentBucket: any = null;
    let bucketRecords: any[] = [];

    records.forEach(record => {
        const timestamp = new Date(record.timestamp);
        let bucketKey: string;

        if (interval === 'hourly') {
            bucketKey = new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate(), timestamp.getHours()).toISOString();
        } else {
            bucketKey = new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate()).toISOString();
        }

        if (!currentBucket || currentBucket !== bucketKey) {
            if (bucketRecords.length > 0) {
                const firstRecord = bucketRecords[0];
                const lastRecord = bucketRecords[bucketRecords.length - 1];
                aggregated.push({
                    timestamp: currentBucket,
                    totalUsage: lastRecord.totalUsage,
                    usageDelta: lastRecord.totalUsage - firstRecord.totalUsage,
                    recordsInBucket: bucketRecords.length
                });
            }
            currentBucket = bucketKey;
            bucketRecords = [record];
        } else {
            bucketRecords.push(record);
        }
    });

    // Don't forget the last bucket
    if (bucketRecords.length > 0) {
        const firstRecord = bucketRecords[0];
        const lastRecord = bucketRecords[bucketRecords.length - 1];
        aggregated.push({
            timestamp: currentBucket,
            totalUsage: lastRecord.totalUsage,
            usageDelta: lastRecord.totalUsage - firstRecord.totalUsage,
            recordsInBucket: bucketRecords.length
        });
    }

    return aggregated;
};
