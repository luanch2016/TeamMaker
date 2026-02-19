'use client';

import { useState } from 'react';
import { Team, Member } from '@/lib/data';

interface ViewEmailsModalProps {
    team: Team;
    isOpen: boolean;
    onClose: () => void;
}

export default function ViewEmailsModal({
    team,
    isOpen,
    onClose,
}: ViewEmailsModalProps) {
    const [leaderEmail, setLeaderEmail] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (leaderEmail.trim().toLowerCase() === team.leader.email.toLowerCase()) {
            setIsVerified(true);
        } else {
            setError('Email does not match team leader email.');
        }
    };

    const handleClose = () => {
        setLeaderEmail('');
        setIsVerified(false);
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {isVerified ? 'Member Emails' : 'Verify Leader Identity'}
                </h2>

                {!isVerified ? (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Please enter the leader's email address to view member contact information.
                        </p>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Leader Email</label>
                            <input
                                type="email"
                                required
                                value={leaderEmail}
                                onChange={(e) => setLeaderEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                placeholder="leader@example.com"
                            />
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                            >
                                Verify
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="border rounded-md divide-y">
                            {team.members.map((member, idx) => (
                                <div key={idx} className="p-3 flex justify-between items-center bg-gray-50">
                                    <div>
                                        <p className="font-medium text-sm text-gray-900">{member.name}</p>
                                        <p className="text-xs text-gray-500">{member.timezone || 'No timezone'}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm text-indigo-600 font-mono bg-indigo-50 px-2 py-1 rounded">
                                            {member.email}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
