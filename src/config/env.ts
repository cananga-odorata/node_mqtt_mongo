//src/config/env.ts
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env';

dotenvConfig({ path: path.resolve(process.cwd(), envFile) });

interface EnvConfig {
  NODE_ENV: 'development' | 'production';
  PORT: number;
}

const config: EnvConfig = {
  NODE_ENV:
   (process.env.NODE_ENV as 'development' | 'production') || 'development',
  PORT: parseInt(process.env.PORT || '3333', 10),
};

export { config };