
'use client';

import { useState, useEffect } from 'react';
import { Team } from '@/lib/data';

interface EditTeamModalProps {
    team: Team;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditTeamModal({ team, isOpen, onClose, onSuccess }: EditTeamModalProps) {
    const [name, setName] = useState(team.name);
    const [subjectId, setSubjectId] = useState(team.subjectId);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(team.name);
            setSubjectId(team.subjectId);
            setError('');
        }
    }, [isOpen, team]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/teams/${team.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, subjectId }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update team');
            }

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Edit Team Details
                                </h3>
                                <div className="mt-4">
                                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                                    <form id="edit-team-form" onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2.5"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject ID</label>
                                            <input
                                                type="text"
                                                required
                                                value={subjectId}
                                                onChange={(e) => setSubjectId(e.target.value)}
                                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2.5"
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="submit"
                            form="edit-team-form"
                            disabled={loading}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
