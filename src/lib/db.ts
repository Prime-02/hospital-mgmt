import { Pool } from 'pg';

const globalForPg = global as unknown as { pgPool: Pool };

export const pool =
  globalForPg.pgPool ??
  new Pool({
    connectionString:
      process.env.DATABASE_URL ||
      'postgresql://postgres:password@localhost:5432/hospital_db',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = pool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
) {
  const start = Date.now();
  const res = await pool.query<T & Record<string, unknown>>(text, params);
  const duration = Date.now() - start;
  if (process.env.NODE_ENV === 'development') {
    console.log('query', { text: text.slice(0, 80), duration, rows: res.rowCount });
  }
  return res;
}
