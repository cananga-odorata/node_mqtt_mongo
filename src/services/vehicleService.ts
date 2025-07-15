//src/services/vehicleService.ts
import { RequestHandler } from "express";
import { client } from "../config/mqtt";
import { configEnv } from "../config/env";

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

const fetchWithTimeout = async (url: string, options: RequestInit, timeoutMs: number = 10000): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        if (!res) {
            throw new Error('No response received from fetch');
        }
        clearTimeout(timeoutId);
        return res;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error instanceof Error ? error : new Error('Unknown fetch error');
    }
};

const retryFetch = async (url: string, options: RequestInit, retries: number = 3, delayMs: number = 1000): Promise<Response> => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fetchWithTimeout(url, options);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (attempt === retries || (error instanceof Error && error.name === 'AbortError')) {
                throw new Error(`Fetch failed after ${retries} retries: ${errorMessage}`);
            }
            console.warn(`Retry ${attempt}/${retries} failed: ${errorMessage}`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
    throw new Error('Retry logic failed to return a response');
};

export const callServiceBoards = async (topic: string, serialnumber: string, rawData: any) => {
    try {
        console.log("Topic:", topic);
        console.log("Serial Number:", serialnumber);
        console.log("Raw Data:", JSON.stringify(rawData, null, 2));
        console.log("callServiceBoards executing...");
        console.log(`URL: ${configEnv.URL_TOYOTA}`);

        const res = await retryFetch(`${configEnv.URL_TOYOTA}/controller/checkbalance`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ serialNumber: serialnumber }),
        });

        console.log('Response Status:', res.status);
        // console.log('Response Headers:', Object.fromEntries(res.headers));

        const contentType = res.headers.get('content-type');
        let resData: any;

        if (contentType && contentType.includes('application/json')) {
            resData = await res.json();
        } else {
            resData = await res.text();
            console.warn('Response is not JSON:', resData);
            resData = { message: resData };
        }

        if (!res.ok) {
            if (resData.message === "don't exist data" || res.status === 500) {
                console.warn(`SerialNumber ${serialnumber} not found or server error:`, resData);
                return { status: 'not_found', message: `SerialNumber ${serialnumber} not found`, data: null };
            }
            throw new Error(`HTTP error! Status: ${res.status}, Detail: ${JSON.stringify(resData)}`);
        }

        console.log('Response Data:', JSON.stringify(resData, null, 2));
        console.log('callServiceBoards completed successfully');
        return { status: 'success', data: resData };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Error in callServiceBoards: ${errorMessage}`);
        return { status: 'error', message: errorMessage, data: null };
    }
};