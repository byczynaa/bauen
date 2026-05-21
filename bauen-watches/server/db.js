// Simple Postgres client for admin dashboard (Node.js)
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.SUPABASE_DB_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function query(text, params) {
  const res = await pool.query(text, params);
  return res;
}

export default { query };
