import mongoose from "mongoose";
import moment from "moment-timezone";
import { IVehicleHeartbeat } from "../../interfaces/databaseInterfaces";

const VehicleHeartbeatSchema = new mongoose.Schema<IVehicleHeartbeat>({
    vehicleId: { type: String, required: true },
    timestamp: { type: Date, default: () => moment().tz("Asia/Bangkok").toDate() },
    rawData: {
        mode: { type: Number, required: true },
        temp: { type: Number, required: true },
        voltage: { type: Number, required: true },
        total_usage_time: { type: Number, required: true },
        sesstion_usage: { type: Number, required: true },
        // credit_overuse: { type: Number, required: true },
    },
});

const VehicleHeartbeatModel = mongoose.model<IVehicleHeartbeat>("VehicleHeartbeat", VehicleHeartbeatSchema);

export default VehicleHeartbeatModel;