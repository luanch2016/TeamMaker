
'use client';

import { useEffect, useState } from 'react';
import { Team } from '@/lib/data';
import CreateTeamForm from './components/CreateTeamForm';
import TeamCard from './components/TeamCard';

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const res = await fetch('/api/teams');
      if (res.ok) {
        const data = await res.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Failed to fetch teams', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            TeamMaker
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Form your dream team. Join existing squads or lead your own.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Create Team */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <CreateTeamForm onSuccess={fetchTeams} />
            </div>
          </div>

          {/* Right Column: Team List */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Available Teams</h2>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                {teams.length} Teams
              </span>
            </div>

            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : teams.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No teams created yet.</p>
                <p className="text-gray-400 text-sm">Be the first to start a team!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teams.map((team) => (
                  <TeamCard key={team.id} team={team} onUpdate={fetchTeams} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
