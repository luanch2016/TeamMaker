
'use client';

import { useState } from 'react';

interface CreateTeamFormProps {
    onSuccess: () => void;
}

export default function CreateTeamForm({ onSuccess }: CreateTeamFormProps) {
    const [name, setName] = useState('');
    const [subjectId, setSubjectId] = useState('');
    const [leaderName, setLeaderName] = useState('');
    const [leaderEmail, setLeaderEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/teams', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, subjectId, leaderName, leaderEmail }),
            });

            if (!res.ok) {
                throw new Error('Failed to create team');
            }

            setName('');
            setSubjectId('');
            setLeaderName('');
            setLeaderEmail('');
            onSuccess();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Team</h2>
            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2.5"
                        placeholder="The Avengers"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject ID</label>
                    <input
                        type="text"
                        required
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2.5"
                        placeholder="e.g. CS101"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leader Name</label>
                    <input
                        type="text"
                        required
                        value={leaderName}
                        onChange={(e) => setLeaderName(e.target.value)}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2.5"
                        placeholder="John Doe"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Leader Email</label>
                    <input
                        type="email"
                        required
                        value={leaderEmail}
                        onChange={(e) => setLeaderEmail(e.target.value)}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2.5"
                        placeholder="john@example.com"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Creating...' : 'Create Team'}
                    </button>
                </div>
            </form>
        </div>
    );
}
