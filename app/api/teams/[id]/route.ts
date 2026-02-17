
import { NextResponse } from 'next/server';
import { deleteTeam, updateTeamDetails } from '@/lib/data';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, subjectId } = body;

        if (!name || !subjectId) {
            return NextResponse.json(
                { error: 'Name and Subject ID are required' },
                { status: 400 }
            );
        }

        const updatedTeam = await updateTeamDetails(id, name, subjectId);

        if (!updatedTeam) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTeam);
    } catch (error) {
        console.error('Error updating team:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
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
        const deleted = await deleteTeam(id);

        if (!deleted) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Team deleted' });
    } catch (error) {
        console.error('Error deleting team:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
