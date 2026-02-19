
import { NextResponse } from 'next/server';
import { getTeamById, scheduleMeeting, Meeting, Member } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { email, topic, startTime } = body;

        if (!email || !topic || !startTime) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const team = await getTeamById(id);

        if (!team) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        // Verify that the requester is a member of the team
        const member = team.members.find((m: Member) => m.email === email);
        if (!member) {
            return NextResponse.json(
                { error: 'You are not a member of this team' },
                { status: 403 }
            );
        }

        // Simulate Zoom Link Creation with a valid-looking 10-digit ID
        const meetingId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const joinUrl = `https://zoom.us/j/${meetingId}`;

        const meeting: Meeting = {
            id: uuidv4(),
            topic,
            startTime,
            joinUrl,
            createdBy: email
        };

        const updatedTeam = await scheduleMeeting(id, meeting);

        return NextResponse.json(updatedTeam);
    } catch (error: any) {
        console.error('Error scheduling meeting:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
