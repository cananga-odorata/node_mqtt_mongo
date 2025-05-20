import mongoose from "mongoose";
import moment from "moment-timezone";
import { IVehicleHeartbeat } from "../../interfaces/databaseInterfaces";

const VehicleHeartbeatSchema = new mongoose.Schema<IVehicleHeartbeat>({
    vehicleId: { type: String, required: true },
    timestamp: { type: Date, default: () => moment().tz("Asia/Bangkok").toDate() },
    rawData: {
        mode: { type: Number, required: true },
        temp: { type: Number, required: true },
        battery: { type: Number, required: true },
        usage_time_mn: { type: Number, required: true },
        credit_remaining: { type: Number, required: true },
        credit_overuse: { type: Number, required: true },
    },
});

const VehicleHeartbeatModel = mongoose.model<IVehicleHeartbeat>("VehicleHeartbeat", VehicleHeartbeatSchema);

export default VehicleHeartbeatModel;