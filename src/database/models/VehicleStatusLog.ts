import mongoose from "mongoose";
import moment from "moment-timezone";
import { IVehicleStatus } from "../../interfaces/databaseInterfaces";

const VehicleStatusSchema = new mongoose.Schema<IVehicleStatus>({
    vehicleId: { type: String, required: true },
    timestamp: { type: Date, default: () => moment().tz("Asia/Bangkok").toDate() },
    rawData: {
        status: { type: Number, required: true, enum: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] },
    },
});

const VehicleStatusModel = mongoose.model<IVehicleStatus>("VehicleStatus", VehicleStatusSchema);

export default VehicleStatusModel;