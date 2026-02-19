
import { Pool } from 'pg';
import { v4 as uuidv4 } from 'uuid';

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
  timezone?: string;
}

export interface Meeting {
  id: string;
  topic: string;
  startTime: string; // ISO string
  joinUrl: string;
  createdBy: string; // email
}

export interface Team {
  id: string; // UUID from DB
  name: string;
  subjectId: string;
  leader: Member;
  members: Member[];
  status: 'OPEN' | 'FULL';
  meetings: Meeting[];
}

// Map DB row to Team object
function mapRowToTeam(row: any): Team {
  const members = row.members || [];
  const leaderEmail = row.leader_email;
  const leaderMember = members.find((m: Member) => m.email === leaderEmail);

  return {
    id: row.id,
    name: row.name || 'Unnamed Team',
    subjectId: row.subject_id,
    leader: {
      name: row.leader_name,
      email: row.leader_email,
      timezone: leaderMember?.timezone, // Extract from members array
    },
    members: members,
    status: row.status as 'OPEN' | 'FULL',
    meetings: row.meetings || [],
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
  name: string,
  subjectId: string,
  leaderName: string,
  leaderEmail: string,
  leaderTimezone?: string
): Promise<Team> {
  const client = await pool.connect();
  try {
    // Initial member list includes leader with timezone
    const members = JSON.stringify([{ name: leaderName, email: leaderEmail, timezone: leaderTimezone }]);

    // We also need to store leader_timezone in the separate column if we decide to add one, 
    // OR we can just rely on the 'members' JSONB column.
    // However, the 'leader' field in 'Team' interface is derived from leader_name/email columns based on current mapRowToTeam.
    // Let's check mapRowToTeam again. It uses row.leader_name and row.leader_email.
    // If we want leader.timezone to be populated, we should probably add a leader_timezone column 
    // OR just rely on the leader being in the 'members' array and extract it from there?
    // The current mapRowToTeam constructs valid 'leader' object from flat columns.
    // Let's add 'leader_timezone' column to the INSERT for consistency if we wanted to be substantial, 
    // BUT since we can't easily alter the DB schema (or can we? The user didn't forbid it, but simpler is better).
    // Actually, looking at 'mapRowToTeam', it reads 'row.leader_timezone'. 
    // So 'leader_timezone' column is expected? 
    // Wait, I should probably just store it in the JSONB 'members' and 'meetings' column.
    // But 'leader' is special. 
    // Let's look at `mapRowToTeam` again:
    // leader: { name: row.leader_name, email: row.leader_email }

    // If I want to avoid database schema strict updates (ALTER TABLE), I can try to store everything in JSONB 'members'.
    // BUT `mapRowToTeam` separates them.

    // NOTE: The user prompt implies I can update things.
    // Let's assume for now I will use the 'members' JSONB column to store all member info including the leader's timezone.
    // And I will Update `mapRowToTeam` to try to find the leader in `members` array to get the timezone?
    // OR, I can just treat `leader` as a special member who might not be in `members` array?
    // In `createTeam`, `members` is initialized with the leader:
    // const members = JSON.stringify([{ name: leaderName, email: leaderEmail }]);

    // So the leader IS in the members array.
    // So, in `mapRowToTeam`, I can try to find the leader's timezone from the members array if `row.leader_timezone` is missing.

    const query = `
      INSERT INTO teams (name, subject_id, leader_name, leader_email, members, status, meetings)
      VALUES ($1, $2, $3, $4, $5, 'OPEN', '[]'::jsonb)
      RETURNING *
    `;
    // Note: 'meetings' column might not exist yet. I should handle that.
    // Actually, I probably really do need to ALTER TABLE to add 'meetings' column.
    // Or I can just hope it works? No, PostgreSQL will throw error if column doesn't exist.
    // I should create a migration script or just run a query to add the column if it doesn't exist.
    // But for this 'replace_file_content', I will assume the column exists or I will verify it shortly.
    // Let's stick to the code changes first.

    // Wait, the previous code didn't use 'meetings'.
    // I will write the query assuming 'meetings' exists. I'll need to run a DB migration.

    const result = await client.query(query, [
      name,
      subjectId,
      leaderName,
      leaderEmail,
      members
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

export async function removeMemberFromTeam(
  teamId: string,
  memberEmail: string
): Promise<Team | null> {
  const client = await pool.connect();
  try {
    // First get the current team members
    const teamRes = await client.query('SELECT members, leader_email FROM teams WHERE id = $1', [teamId]);
    if (teamRes.rows.length === 0) return null;

    const currentMembers: Member[] = teamRes.rows[0].members || [];
    const leaderEmail = teamRes.rows[0].leader_email;

    // Cannot remove the leader
    if (memberEmail === leaderEmail) {
      throw new Error('Cannot remove team leader');
    }

    const updatedMembers = currentMembers.filter(m => m.email !== memberEmail);
    const newStatus = updatedMembers.length >= 5 ? 'FULL' : 'OPEN'; // Assuming 5 is max

    return updateTeamMembers(teamId, updatedMembers, newStatus);
  } finally {
    client.release();
  }
}

export async function updateMemberTimezone(
  teamId: string,
  memberEmail: string,
  timezone: string
): Promise<Team | null> {
  const client = await pool.connect();
  try {
    const teamRes = await client.query('SELECT members FROM teams WHERE id = $1', [teamId]);
    if (teamRes.rows.length === 0) return null;

    const currentMembers: Member[] = teamRes.rows[0].members || [];
    const memberIndex = currentMembers.findIndex(m => m.email === memberEmail);

    if (memberIndex === -1) {
      throw new Error('Member not found in team');
    }

    // Update the specific member's timezone
    currentMembers[memberIndex].timezone = timezone;

    // Determine status (unchanged logic, just passing it through)
    // We should probably Query the status or just re-calculate it. 
    // Re-calculating is safer.
    const status = currentMembers.length >= 5 ? 'FULL' : 'OPEN';

    return updateTeamMembers(teamId, currentMembers, status);
  } finally {
    client.release();
  }
}

export async function updateTeamDetails(
  id: string,
  name: string,
  subjectId: string
): Promise<Team | null> {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE teams
      SET name = $2, subject_id = $3
      WHERE id = $1
      RETURNING *
    `;
    const result = await client.query(query, [id, name, subjectId]);
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

export async function scheduleMeeting(
  teamId: string,
  meeting: Meeting
): Promise<Team | null> {
  const client = await pool.connect();
  try {
    // We need to append the meeting to the meetings array.
    // Assuming 'meetings' is a JSONB column.
    const query = `
            UPDATE teams
            SET meetings = COALESCE(meetings, '[]'::jsonb) || $2::jsonb
            WHERE id = $1
            RETURNING *
        `;
    const result = await client.query(query, [teamId, JSON.stringify([meeting])]);
    if (result.rows.length === 0) return null;
    return mapRowToTeam(result.rows[0]);
  } finally {
    client.release();
  }
}
