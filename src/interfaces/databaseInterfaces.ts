export interface IVehicleStatus {
    vehicleId: string;
    timestamp: Date;
    rawData: {
        status?: number;
        model?: number;
    };
}

export interface IVehicleHeartbeat {
    vehicleId: string;
    timestamp: Date;
    rawData: {
        mode: number;
        temp: number;
        voltage?: number;
        battery?: number;
        total_usage_time?: number;
        sesstion_usage?: number;
        usage_time_mn?: number;
        credit_remaining?: number;
        credit_overuse?: number;
    };
}