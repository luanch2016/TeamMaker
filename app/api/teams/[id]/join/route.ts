
import { NextResponse } from 'next/server';
import { getTeamById, updateTeamMembers } from '@/lib/data';

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

        const team = await getTeamById(id);

        if (!team) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        if (team.members.length >= 5) {
            return NextResponse.json({ error: 'Team is full' }, { status: 400 });
        }

        team.members.push({ name, email });

        let status: 'OPEN' | 'FULL' = team.status;
        if (team.members.length >= 5) {
            status = 'FULL';
        }

        const updatedTeam = await updateTeamMembers(id, team.members, status);

        return NextResponse.json(updatedTeam);
    } catch (error) {
        console.error('Error joining team:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
