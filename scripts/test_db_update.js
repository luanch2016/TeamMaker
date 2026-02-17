
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testUpdate() {
    const client = await pool.connect();
    try {
        // 1. Get a team
        const res = await client.query('SELECT * FROM teams LIMIT 1');
        if (res.rows.length === 0) {
            console.log('No teams found to test.');
            return;
        }
        const team = res.rows[0];
        console.log('Original Team:', team.name, team.subject_id);

        // 2. Update via DB function simulation (checking if query works)
        const newName = 'Updated Name ' + Date.now();
        const newSubject = 'Updated Subject ' + Date.now();

        console.log(`Attempting to update team ${team.id} to Name: ${newName}, Subject: ${newSubject}`);

        const updateQuery = `
      UPDATE teams
      SET name = $2, subject_id = $3
      WHERE id = $1
      RETURNING *
    `;
        const updateRes = await client.query(updateQuery, [team.id, newName, newSubject]);

        if (updateRes.rows.length > 0) {
            console.log('Update successful:', updateRes.rows[0].name, updateRes.rows[0].subject_id);
        } else {
            console.log('Update returned no rows.');
        }

    } catch (err) {
        console.error('Test failed:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

testUpdate();
