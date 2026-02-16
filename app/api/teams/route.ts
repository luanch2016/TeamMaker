
import { NextResponse } from 'next/server';
import { getTeams, createTeam } from '@/lib/data';

export async function GET() {
    try {
        const teams = await getTeams();
        return NextResponse.json(teams);
    } catch (error) {
        console.error('Error fetching teams:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
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

        const newTeam = await createTeam(subjectId, leaderName, leaderEmail);

        return NextResponse.json(newTeam, { status: 201 });
    } catch (error) {
        console.error('Error creating team:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
