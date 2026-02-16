
import { NextResponse } from 'next/server';
import { deleteTeam } from '@/lib/data';

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
