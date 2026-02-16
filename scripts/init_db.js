
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function initDb() {
    const client = await pool.connect();
    try {
        console.log('Creating teams table...');
        await client.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        subject_id TEXT NOT NULL,
        leader_name TEXT NOT NULL,
        leader_email TEXT NOT NULL,
        members JSONB DEFAULT '[]',
        status TEXT DEFAULT 'OPEN'
      );
    `);
        console.log('Table created successfully!');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

initDb();
