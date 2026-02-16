
import { NextResponse } from 'next/server';
import { readTeams, writeTeams } from '@/lib/data';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const teams = await readTeams();
        const filteredTeams = teams.filter((t) => t.id !== id);

        if (teams.length === filteredTeams.length) {
            return NextResponse.json({ error: 'Team not found' }, { status: 404 });
        }

        await writeTeams(filteredTeams);
        return NextResponse.json({ message: 'Team deleted' });
    } catch (error) {
        console.error('Error deleting team:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
