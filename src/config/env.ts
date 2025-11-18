import { config as dotenvConfig } from 'dotenv';
import path from 'path';

const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env';

dotenvConfig({ path: path.resolve(process.cwd(), envFile) });

interface EnvConfig {
  NODE_ENV: 'development' | 'production';
  PORT: number;
  MQTT_BROKER_URL: string;
  MQTT_USERNAME: string;
  MQTT_PASSWORD: string;
  BOARDS: string;
  MONGO_URL: string;
  MQTT_CLIENTID?: string;
  URL_TOYOTA?: string;
  CHECKBALANCE_URL?: string;
}

const configEnv: EnvConfig = {
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production') || 'development',
  PORT: parseInt(process.env.PORT || '3333', 10),
  MQTT_BROKER_URL: process.env.MQTT_BROKER_URL || 'mqtts://mqtt-liftngo.vendingtech.co.th',
  MQTT_USERNAME: process.env.MQTT_USERNAME || '',
  MQTT_PASSWORD: process.env.MQTT_PASSWORD || '',
  BOARDS: process.env.BOARDS || 'DTTT1',
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/mydatabase',
  MQTT_CLIENTID: process.env.MQTT_CLIENTID,
  URL_TOYOTA: process.env.URL_TOYOTA || "",
  CHECKBALANCE_URL: process.env.CHECKBALANCE_URL || "",
};

if (!configEnv.MQTT_BROKER_URL) {
  throw new Error('MQTT_BROKER_URL is required');
}

export { configEnv };