
import { NextResponse } from 'next/server';
import { removeMemberFromTeam } from '@/lib/data';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { email, timezone } = body;

        console.log('Updating member:', email, 'in team:', id, 'timezone:', timezone);

        if (!email || !timezone) {
            return NextResponse.json({ error: 'Member email and timezone are required' }, { status: 400 });
        }

        // We need to import this function, ensure it is exported from lib/data
        const { updateMemberTimezone } = await import('@/lib/data');
        const updatedTeam = await updateMemberTimezone(id, email, timezone);

        if (!updatedTeam) {
            return NextResponse.json({ error: 'Team not found or member not in team' }, { status: 404 });
        }

        return NextResponse.json(updatedTeam);
    } catch (error: any) {
        console.error('Error updating member:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { email } = body;

        console.log('Removing member:', email, 'from team:', id);

        if (!email) {
            return NextResponse.json({ error: 'Member email is required' }, { status: 400 });
        }

        const updatedTeam = await removeMemberFromTeam(id, email);

        if (!updatedTeam) {
            return NextResponse.json({ error: 'Team not found or member not in team' }, { status: 404 });
        }

        return NextResponse.json(updatedTeam);
    } catch (error: any) {
        console.error('Error removing member:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
