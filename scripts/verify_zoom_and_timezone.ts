import { createTeam, updateMemberTimezone, Team } from '../lib/data';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function test() {
    console.log('Starting verification...');

    // 1. Create a Team
    console.log('\n--- Creating Team ---');
    const team = await createTeam(
        'Test Zoom Team',
        'SUBJ-101',
        'Leader One',
        'leader@test.com',
        'UTC'
    );
    console.log('Team created:', team.id);

    // 2. Schedule Meeting Link Verification (Simulation)
    console.log('\n--- Verifying Zoom Link Format Logic ---');
    const meetingId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const joinUrl = `https://zoom.us/j/${meetingId}`;
    console.log('Generated Join URL:', joinUrl);
    if (/^https:\/\/zoom\.us\/j\/\d{10}$/.test(joinUrl)) {
        console.log('✅ Zoom Link format is correct (10 digits)');
    } else {
        console.error('❌ Zoom Link format is incorrect');
    }

    // 3. Test `updateMemberTimezone`
    console.log('\n--- Updating Member Timezone ---');
    try {
        const updatedTeam = await updateMemberTimezone(team.id, 'leader@test.com', 'America/New_York');
        if (updatedTeam) {
            const leader = updatedTeam.members.find(m => m.email === 'leader@test.com');
            if (leader?.timezone === 'America/New_York') {
                console.log('✅ Timezone updated successfully to America/New_York');
            } else {
                console.error('❌ Timezone update failed. Got:', leader?.timezone);
            }
        } else {
            console.error('❌ Failed to update team members');
        }
    } catch (error) {
        console.error('❌ Error updating timezone:', error);
    }

    // 4. Clean up
    const { deleteTeam } = await import('../lib/data');
    await deleteTeam(team.id);
    console.log('\n--- Cleanup Done ---');
    process.exit(0);
}

test().catch((err) => {
    console.error(err);
    process.exit(1);
});
