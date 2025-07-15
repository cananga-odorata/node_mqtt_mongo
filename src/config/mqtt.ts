//src/config/mqtt.ts
import mqtt from "mqtt";
import { configEnv } from "./env";
import pino from "pino";

const logger = pino();

const { MQTT_BROKER_URL, MQTT_USERNAME, MQTT_PASSWORD } = configEnv;

const boardId = process.env.BOARDS || "DTTT1";
const MQTT_CLIENTID = configEnv.MQTT_CLIENTID || `${boardId}-${Date.now()}`;

const url = new URL(MQTT_BROKER_URL);
let port = url.port ? parseInt(url.port, 10) : undefined;
if (!port) {
    port = url.protocol === 'mqtts:' ? 8883 : 1883;
}
if ((url.protocol === 'mqtts:' && port !== 8883) || (url.protocol === 'mqtt:' && port !== 1883)) {
    logger.warn(`MQTT configEnv: Protocol (${url.protocol}) and port (${port}) may not match standard usage.`);
}

export const client = mqtt.connect(MQTT_BROKER_URL, {
    port,
    username: MQTT_USERNAME,
    password: MQTT_PASSWORD,
    clientId: MQTT_CLIENTID,
    reconnectPeriod: 5000,
    clean: false,
    // will: {
    //     topic: `vehicle/${boardId}/status`,
    //     payload: JSON.stringify({ status: 0 }),
    //     qos: 2,
    //     retain: true,
    // }
});

client.on("error", (err) => {
    logger.error({ err }, "MQTT Connection Error");
});

client.on("close", () => {
    logger.warn("Disconnected from MQTT Broker");
});

client.on("reconnect", () => {
    logger.info("Reconnecting to MQTT Broker");
});

client.on("offline", () => {
    logger.warn("MQTT Broker is offline");
});

client.on('connect', () => {
    logger.info(`Connected to MQTT Broker with clientId: ${MQTT_CLIENTID} at ${MQTT_BROKER_URL} on port ${port}`);
});