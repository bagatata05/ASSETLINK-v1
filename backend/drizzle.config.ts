import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  dialect: 'mysql',
  schema: './src/db/schema.ts',
  out: './drizzle',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_NAME || 'assetlink',
    port: parseInt(process.env.DB_PORT || '3306', 10),
  },
} satisfies Config;
