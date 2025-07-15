//src/services/mqttService.ts
import { client } from "../config/mqtt";
import { MQTT_TOPICS } from "../config/mqttTopics";
import { callServiceBoards } from "./vehicleService";


export const setupMqtt = () => {
    client.on("connect", () => {
        console.log("Connected to MQTT Broker");

        const topics = [MQTT_TOPICS.RDSTATUS];

        topics.forEach((topic) => {
            client.subscribe(topic, { qos: 2 }, (err) => {
                if (err) console.error(`Subscribe error for ${topic}:`, err);
                else console.log(`Subscribed to ${topic} at ${new Date().toISOString()}`);
            });
        });
        setTimeout(() => console.log("Subscriptions confirmed"), 1000)
    });

    client.on("message", async (topic, message) => {
        console.log(`Received message on topic: ${topic}`);
        console.log(`Raw Message: ${message.toString()}`);

        const serialnumber = topic.split("/")[1];
        let data;
        console.log("data MQTT Service :", message.toString())
        try {
            data = JSON.parse(message.toString());
            if (!topic.endsWith('/status') && !topic.endsWith('/rdstatus')) {
                if (!data.data || !Array.isArray(data.data)) {
                    console.error(`Invalid data: data.data must be an array for topic ${topic}:`, data);
                    return;
                }
            }
        } catch (error) {
            console.error("Failed to parse message:", error);
            return;
        }
        await callServiceBoards(topic, serialnumber, data);
    });
};