
import { NextResponse } from 'next/server';
import { readTeams, writeTeams, Team } from '@/lib/data';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json(
                { error: 'Missing name or email' },
                { status: 400 }
            );
        }

        const teams = await readTeams();
        const teamIndex = teams.findIndex((t) => t.id === id);

        if (teamIndex === -1) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        const team = teams[teamIndex];

        if (team.members.length >= 5) {
            return NextResponse.json({ error: 'Team is full' }, { status: 400 });
        }

        team.members.push({ name, email });

        if (team.members.length >= 5) {
            team.status = 'FULL';
        }

        teams[teamIndex] = team;
        await writeTeams(teams);

        return NextResponse.json(team);
    } catch (error) {
        console.error('Error joining team:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
