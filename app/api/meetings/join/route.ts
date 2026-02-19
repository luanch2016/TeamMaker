import { NextResponse } from 'next/server';
import { getTeamById, Member } from '@/lib/data';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { teamId, meetingId, email } = body;

        if (!teamId || !meetingId || !email) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const team = await getTeamById(teamId);

        if (!team) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        // Verify member
        const member = team.members.find((m: Member) => m.email === email);
        if (!member) {
            return NextResponse.json(
                { error: 'Email not found in team members' },
                { status: 403 }
            );
        }

        // Find meeting
        const meeting = team.meetings.find(m => m.id === meetingId);
        if (!meeting) {
            return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
        }

        return NextResponse.json({ joinUrl: meeting.joinUrl });
    } catch (error: any) {
        console.error('Error verifying meeting access:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
