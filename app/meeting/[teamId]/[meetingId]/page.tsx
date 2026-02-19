'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';

export default function MeetingSecurityPage({
    params
}: {
    params: Promise<{ teamId: string; meetingId: string }>
}) {
    // Unguard params
    const { teamId, meetingId } = use(params);

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // We need a new API route to verify usage: /api/teams/[id]/meetings/[meetingId]/join
            // But to keep it simple and safe, we can use a server action or a specific API route.
            // Let's create `app/api/meeting/join/route.ts` that takes teamId, meetingId, and email.

            const res = await fetch('/api/meetings/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ teamId, meetingId, email }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Verification failed');
            }

            const data = await res.json();
            // Redirect to the actual Zoom URL
            window.location.href = data.joinUrl;
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Security Check
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Please enter your team member email to access this meeting.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {loading ? 'Verifying...' : 'Join Meeting'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
