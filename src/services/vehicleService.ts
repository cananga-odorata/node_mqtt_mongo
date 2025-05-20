import { RequestHandler } from "express";
import { client } from "../config/mqtt";

export const postWrStatus: RequestHandler = (req, res) => {
    const { status, vehicleId } = req.body;
    if (typeof status !== 'number' || !vehicleId) {
        res.status(400).json({ error: 'Missing or invalid status or vehicleId' });
        return;
    }
    const topic = `vehicle/${vehicleId}/wrstatus`;
    client.publish(topic, JSON.stringify({ status }), { qos: 1 }, (err?: Error) => {
        if (err) {
            res.status(500).json({ error: 'Failed to publish to MQTT', details: err.message });
            return;
        }
        res.json({ success: true, topic, status });
    });
};