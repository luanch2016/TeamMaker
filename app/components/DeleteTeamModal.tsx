'use client';

import { useState } from 'react';
import { Team } from '@/lib/data';

interface DeleteTeamModalProps {
    team: Team;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function DeleteTeamModal({
    team,
    isOpen,
    onClose,
    onSuccess,
}: DeleteTeamModalProps) {
    const [leaderEmail, setLeaderEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Client-side verification
            if (leaderEmail.trim().toLowerCase() !== team.leader.email.toLowerCase()) {
                throw new Error('Email does not match team leader email.');
            }

            // 2. Perform Delete
            const res = await fetch(`/api/teams/${team.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete team');
            }

            setLeaderEmail('');
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setLeaderEmail('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-xl font-bold mb-4 text-red-600">Delete Team</h2>
                <div className="mb-4">
                    <p className="text-gray-700 font-medium">Are you sure you want to delete <span className="font-bold">{team.name}</span>?</p>
                    <p className="text-sm text-gray-500 mt-2">This action cannot be undone. To confirm, please enter the leader's email address.</p>
                </div>

                {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

                <form onSubmit={handleDelete} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Leader Email</label>
                        <input
                            type="email"
                            required
                            value={leaderEmail}
                            onChange={(e) => setLeaderEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm border p-2"
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
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
                        >
                            {loading ? 'Deleting...' : 'Delete Team'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
