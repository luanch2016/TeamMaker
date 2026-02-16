
const BASE_URL = 'http://localhost:3000';

async function verify() {
    console.log('Starting verification...');

    // 1. Create Team
    console.log('1. Creating Team...');
    const createRes = await fetch(`${BASE_URL}/api/teams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            subjectId: 'TEST-101',
            leaderName: 'Leader',
            leaderEmail: 'leader@test.com'
        })
    });

    if (!createRes.ok) {
        console.error('Failed to create team', await createRes.text());
        return;
    }

    const team = await createRes.json();
    console.log('Team created:', team.id);

    // 2. Join Team (3 times to fill it -> 1 leader + 4 members = 5)
    // Wait, leader counts as 1. So 4 joins needed to reach 5.
    const members = [
        { name: 'M1', email: 'm1@test.com' },
        { name: 'M2', email: 'm2@test.com' },
        { name: 'M3', email: 'm3@test.com' },
        { name: 'M4', email: 'm4@test.com' }
    ];

    for (const m of members) {
        console.log(`Joining ${m.name}...`);
        const joinRes = await fetch(`${BASE_URL}/api/teams/${team.id}/join`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(m)
        });

        if (!joinRes.ok) {
            console.error(`Failed to join ${m.name}`, await joinRes.text());
            return;
        }
    }

    // 3. Verify Full
    console.log('Verifying team status...');
    const verifyRes = await fetch(`${BASE_URL}/api/teams`);
    const teams = await verifyRes.json();
    const updatedTeam = teams.find((t) => t.id === team.id);

    if (updatedTeam.status !== 'FULL') {
        console.error('Team status should be FULL', updatedTeam);
    } else {
        console.log('Team status is FULL. Success!');
    }

    // 4. Try to join full team
    console.log('Attempting to join full team...');
    const failJoinRes = await fetch(`${BASE_URL}/api/teams/${team.id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Late', email: 'late@test.com' })
    });

    if (failJoinRes.status === 400) {
        console.log('Blocked joining full team. Success!');
    } else {
        console.error('Should have failed to join full team', failJoinRes.status);
    }

    // 5. Delete Team
    console.log('Deleting team...');
    const deleteRes = await fetch(`${BASE_URL}/api/teams/${team.id}`, {
        method: 'DELETE'
    });

    if (!deleteRes.ok) {
        console.error('Failed to delete team', await deleteRes.text());
        return;
    }

    const verifyDeleteRes = await fetch(`${BASE_URL}/api/teams`);
    const teamsAfterDelete = await verifyDeleteRes.json();
    const deletedTeam = teamsAfterDelete.find((t) => t.id === team.id);

    if (!deletedTeam) {
        console.log('Team deleted successfully. Success!');
    } else {
        console.error('Team still exists after delete');
    }
}

verify().catch(console.error);
