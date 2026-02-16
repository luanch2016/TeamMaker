
import { Pool } from 'pg';

// Create a new pool using the connection string from environment variables
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export interface Member {
  name: string;
  email: string;
}

export interface Team {
  id: string; // UUID from DB
  subjectId: string;
  leader: Member;
  members: Member[];
  status: 'OPEN' | 'FULL';
}

// Map DB row to Team object
function mapRowToTeam(row: any): Team {
  return {
    id: row.id,
    subjectId: row.subject_id,
    leader: {
      name: row.leader_name,
      email: row.leader_email,
    },
    members: row.members || [],
    status: row.status as 'OPEN' | 'FULL',
  };
}

export async function getTeams(): Promise<Team[]> {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM teams ORDER BY subject_id ASC');
    return result.rows.map(mapRowToTeam);
  } finally {
    client.release();
  }
}

export async function createTeam(
  subjectId: string,
  leaderName: string,
  leaderEmail: string
): Promise<Team> {
  const client = await pool.connect();
  try {
    const members = JSON.stringify([{ name: leaderName, email: leaderEmail }]);
    const query = `
      INSERT INTO teams (subject_id, leader_name, leader_email, members, status)
      VALUES ($1, $2, $3, $4, 'OPEN')
      RETURNING *
    `;
    const result = await client.query(query, [
      subjectId,
      leaderName,
      leaderEmail,
      members,
    ]);
    return mapRowToTeam(result.rows[0]);
  } finally {
    client.release();
  }
}

export async function getTeamById(id: string): Promise<Team | null> {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM teams WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    return mapRowToTeam(result.rows[0]);
  } finally {
    client.release();
  }
}

export async function updateTeamMembers(
  id: string,
  members: Member[],
  status: 'OPEN' | 'FULL'
): Promise<Team | null> {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE teams
      SET members = $2::jsonb, status = $3
      WHERE id = $1
      RETURNING *
    `;
    const result = await client.query(query, [id, JSON.stringify(members), status]);
    if (result.rows.length === 0) return null;
    return mapRowToTeam(result.rows[0]);
  } finally {
    client.release();
  }
}

export async function deleteTeam(id: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM teams WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  } finally {
    client.release();
  }
}
