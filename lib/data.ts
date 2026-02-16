
import fs from 'fs/promises';
import path from 'path';

export interface Member {
  name: string;
  email: string;
}

export interface Team {
  id: string; // UUID
  subjectId: string;
  leader: Member;
  members: Member[];
  status: 'OPEN' | 'FULL';
}

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'teams.json');

export async function readTeams(): Promise<Team[]> {
  try {
    const data = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

export async function writeTeams(teams: Team[]): Promise<void> {
  await fs.writeFile(DATA_FILE_PATH, JSON.stringify(teams, null, 2), 'utf-8');
}
