export interface IVehicleStatus {
    vehicleId: string;
    timestamp: Date;
    rawData: {
        status: number;
    };
}

export interface IVehicleHeartbeat {
    vehicleId: string;
    timestamp: Date;
    rawData: {
        mode: number;
        temp: number;
        battery: number;
        usage_time_mn: number;
        credit_remaining: number;
        credit_overuse: number;
    };
}