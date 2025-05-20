//src/config/mqtt.ts
import mqtt from "mqtt";
import { config } from "./env";

const { MQTT_BROKER_URL, MQTT_USERNAME, MQTT_PASSWORD } = config;

const boardId = process.env.BOARDS || "DTTT1";
const MQTT_CLIENTID = config.MQTT_CLIENTID || boardId;

export const client = mqtt.connect(MQTT_BROKER_URL, {
    port: 1883,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clientId: MQTT_CLIENTID,
    reconnectPeriod: 5000,
    clean: false,
    will: {
        topic: `vehicle/${boardId}/status`,
        payload: JSON.stringify({ status: 0 }),
        qos: 2,
        retain: true,
    }
});

client.on("error", (err) => {
    console.log("MQTT Connection Error:", err);
});

client.on("close", () => {
    console.log("Disconnected from MQTT Broker");
});

client.on("reconnect", () => {
    console.log("Reconnecting to MQTT Broker");
});

client.on("offline", () => {
    console.log("MQTT Broker is offline");
});

client.on('connect', () => {
    console.log(`Connected to MQTT Broker with clientId: ${MQTT_CLIENTID}`);
});