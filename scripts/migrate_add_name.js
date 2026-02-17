
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('Running migration: Add name column to teams table');
    await client.query('ALTER TABLE teams ADD COLUMN IF NOT EXISTS name TEXT;');
    console.log('Migration successful');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
