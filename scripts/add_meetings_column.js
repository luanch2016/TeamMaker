
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
        console.log('Adding meetings column to teams table...');
        await client.query(`
      ALTER TABLE teams 
      ADD COLUMN IF NOT EXISTS meetings JSONB DEFAULT '[]'::jsonb;
    `);
        console.log('Migration successful');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        client.release();
        pool.end();
    }
}

migrate();
