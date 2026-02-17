
import { NextResponse } from 'next/server';
import { removeMemberFromTeam } from '@/lib/data';

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
