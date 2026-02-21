import pg from 'pg';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: config.databaseUrl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  logger.error(`Unexpected database error: ${err.message}`);
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    logger.debug(`Query executed in ${duration}ms: ${text}`);
    return res;
  } catch (error) {
    logger.error(`Database query error: ${error}`);
    throw error;
  }
}

export async function getClient() {
  const client = await pool.connect();
  return client;
}
