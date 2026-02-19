
'use client';

import { useState } from 'react';
import { Team } from '@/lib/data';
import JoinTeamModal from './JoinTeamModal';
import EditTeamModal from './EditTeamModal';
import ScheduleMeetingModal from './ScheduleMeetingModal';
import ViewEmailsModal from './ViewEmailsModal';
import DeleteTeamModal from './DeleteTeamModal';
import RemoveMemberModal from './RemoveMemberModal';

interface TeamCardProps {
    team: Team;
    onUpdate: () => void;
}

export default function TeamCard({ team, onUpdate }: TeamCardProps) {
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isViewEmailsModalOpen, setIsViewEmailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isRemoveMemberModalOpen, setIsRemoveMemberModalOpen] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
    const [editingMemberEmail, setEditingMemberEmail] = useState<string | null>(null);
    const [editingTimezone, setEditingTimezone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const isFull = team.members.length >= 5 || team.status === 'FULL';

    const handleUpdateTimezone = async (email: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/teams/${team.id}/members`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, timezone: editingTimezone }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update timezone');
            }
            setEditingMemberEmail(null);
            onUpdate();
        } catch (error) {
            console.error('Failed to update timezone:', error);
            alert('Failed to update timezone');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveMemberClick = (memberEmail: string) => {
        setMemberToRemove(memberEmail);
        setIsRemoveMemberModalOpen(true);
    };

    const handleConfirmRemoveMember = async () => {
        if (!memberToRemove) return;

        try {
            const res = await fetch(`/api/teams/${team.id}/members`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: memberToRemove }),
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
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
            <div className="p-6 flex-grow">
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
                            <p><span className="font-medium">Leader:</span> {team.leader.name} {team.leader.timezone && <span className="text-xs text-gray-400">({team.leader.timezone})</span>}</p>
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
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-700">
                            Members ({team.members.length}/5)
                        </h4>
                        <button
                            onClick={() => setIsViewEmailsModalOpen(true)}
                            className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                            View Emails
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {team.members.map((member, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center justify-between bg-gray-50 p-2 rounded-md">
                                <div className="flex items-center">
                                    <span className="w-2 h-2 bg-indigo-400 rounded-full mr-2"></span>
                                    <span>
                                        {member.name}
                                    </span>
                                    <div className="ml-2 flex items-center">
                                        {editingMemberEmail === member.email ? (
                                            <div className="flex items-center gap-1">
                                                <select
                                                    className="text-xs border rounded p-1"
                                                    value={editingTimezone}
                                                    onChange={(e) => setEditingTimezone(e.target.value)}
                                                >
                                                    <option value="">Select Timezone</option>
                                                    {Intl.supportedValuesOf('timeZone').map(tz => (
                                                        <option key={tz} value={tz}>{tz}</option>
                                                    ))}
                                                </select>
                                                <button
                                                    onClick={() => handleUpdateTimezone(member.email)}
                                                    className="text-green-600 hover:text-green-800"
                                                    disabled={isLoading}
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => setEditingMemberEmail(null)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                {member.timezone && <span className="text-xs text-gray-400">({member.timezone})</span>}
                                                <button
                                                    onClick={() => {
                                                        setEditingMemberEmail(member.email);
                                                        setEditingTimezone(member.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);
                                                    }}
                                                    className="ml-2 text-gray-400 hover:text-indigo-600"
                                                    title="Edit Timezone"
                                                >
                                                    ✎
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                {member.email !== team.leader.email && (
                                    <button
                                        onClick={() => handleRemoveMemberClick(member.email)}
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

                {team.meetings && team.meetings.length > 0 && (
                    <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Scheduled Meetings
                        </h4>
                        <ul className="space-y-2">
                            {team.meetings.map((meeting) => (
                                <li key={meeting.id} className="text-sm bg-blue-50 p-2 rounded-md border border-blue-100">
                                    <div className="font-medium text-blue-900">{meeting.topic}</div>
                                    <div className="text-xs text-blue-700">
                                        {new Date(meeting.startTime).toLocaleString()}
                                    </div>
                                    <a
                                        href={`/meeting/${team.id}/${meeting.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-indigo-600 hover:underline block mt-1"
                                    >
                                        Join Zoom Call
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="p-6 pt-0 mt-auto">
                <button
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="w-full bg-blue-50 text-blue-700 font-medium py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors duration-200 mb-2"
                >
                    Schedule Zoom Call
                </button>

                {!isFull && (
                    <button
                        onClick={() => setIsJoinModalOpen(true)}
                        className="w-full bg-indigo-50 text-indigo-700 font-medium py-2 px-4 rounded-lg hover:bg-indigo-100 transition-colors duration-200 mb-2"
                    >
                        Join Team
                    </button>
                )}
                <button
                    onClick={() => setIsDeleteModalOpen(true)}
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

            <ScheduleMeetingModal
                teamId={team.id}
                isOpen={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                onSuccess={onUpdate}
            />

            <ViewEmailsModal
                team={team}
                isOpen={isViewEmailsModalOpen}
                onClose={() => setIsViewEmailsModalOpen(false)}
            />

            <DeleteTeamModal
                team={team}
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onSuccess={onUpdate}
            />

            <RemoveMemberModal
                isOpen={isRemoveMemberModalOpen}
                onClose={() => {
                    setIsRemoveMemberModalOpen(false);
                    setMemberToRemove(null);
                }}
                onConfirm={handleConfirmRemoveMember}
                memberEmail={memberToRemove || ''}
                leaderEmail={team.leader.email}
            />
        </div>
    );
}
