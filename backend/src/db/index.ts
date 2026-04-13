import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { config } from '../config/unifiedConfig';
import * as schema from './schema';

const poolConnection = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  port: config.database.port,
});

export const db = drizzle(poolConnection, { schema, mode: 'default' });
