
import { NextResponse } from 'next/server';
import { readTeams, writeTeams, Team, Member } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const teams = await readTeams();
    return NextResponse.json(teams);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { subjectId, leaderName, leaderEmail } = body;

        if (!subjectId || !leaderName || !leaderEmail) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const newTeam: Team = {
            id: uuidv4(),
            subjectId,
            leader: { name: leaderName, email: leaderEmail },
            members: [{ name: leaderName, email: leaderEmail }],
            status: 'OPEN',
        };

        const teams = await readTeams();
        teams.push(newTeam);
        await writeTeams(teams);

        return NextResponse.json(newTeam, { status: 201 });
    } catch (error) {
        console.error('Error creating team:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
