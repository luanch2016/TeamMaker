
'use client';

import { useState } from 'react';
import { Team } from '@/lib/data';
import JoinTeamModal from './JoinTeamModal';

interface TeamCardProps {
    team: Team;
    onUpdate: () => void;
}

export default function TeamCard({ team, onUpdate }: TeamCardProps) {
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    const isFull = team.members.length >= 5 || team.status === 'FULL';

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Subject: {team.subjectId}
                        </h3>
                        <p className="text-sm text-gray-500">Leader: {team.leader.name}</p>
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
                    <ul className="space-y-1">
                        {team.members.map((member, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                                {member.name}
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
        </div>
    );
}
