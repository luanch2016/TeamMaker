
'use client';

import { useState } from 'react';
import { Team } from '@/lib/data';
import JoinTeamModal from './JoinTeamModal';
import EditTeamModal from './EditTeamModal';

interface TeamCardProps {
    team: Team;
    onUpdate: () => void;
}

export default function TeamCard({ team, onUpdate }: TeamCardProps) {
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const isFull = team.members.length >= 5 || team.status === 'FULL';

    const handleRemoveMember = async (memberEmail: string) => {
        if (!confirm(`Are you sure you want to remove this member?`)) return;

        try {
            const res = await fetch(`/api/teams/${team.id}/members`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: memberEmail }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to remove member');
            }
            onUpdate();
        } catch (error) {
            console.error('Failed to remove member:', error);
            alert('Failed to remove member');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-gray-900">
                                {team.name}
                            </h3>
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="text-gray-400 hover:text-indigo-600 transition-colors"
                                title="Edit Team Details"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                            <p><span className="font-medium">Subject:</span> {team.subjectId}</p>
                            <p><span className="font-medium">Leader:</span> {team.leader.name}</p>
                        </div>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${isFull
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                            }`}
                    >
                        {isFull ? 'FULL' : 'OPEN'}
                    </span>
                </div>

                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Members ({team.members.length}/5)
                    </h4>
                    <ul className="space-y-2">
                        {team.members.map((member, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                                    {member.name}
                                </div>
                                {member.email !== team.leader.email && (
                                    <button
                                        onClick={() => handleRemoveMember(member.email)}
                                        className="text-red-500 hover:text-red-700 text-xs px-2 py-1 rounded hover:bg-red-50 transition-colors"
                                        title="Remove member"
                                    >
                                        Remove
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {!isFull && (
                    <button
                        onClick={() => setIsJoinModalOpen(true)}
                        className="w-full bg-indigo-50 text-indigo-700 font-medium py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors duration-200 mb-2"
                    >
                        Join Team
                    </button>
                )}
                <button
                    onClick={async () => {
                        if (confirm('Are you sure you want to delete this team?')) {
                            await fetch(`/api/teams/${team.id}`, { method: 'DELETE' });
                            onUpdate();
                        }
                    }}
                    className="w-full bg-red-50 text-red-700 font-medium py-2 px-4 rounded-lg hover:bg-red-100 transition-colors duration-200"
                >
                    Delete Team
                </button>
            </div>

            <JoinTeamModal
                teamId={team.id}
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                onSuccess={onUpdate}
            />

            <EditTeamModal
                team={team}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={onUpdate}
            />
        </div>
    );
}
