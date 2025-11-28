'use client';

import { useState, useEffect } from 'react';
import StatsSkeleton from '../../ui/stats-skeleton';
import type { PlatformStats } from '@/types/user';

export default function GlobalStats() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/stats/global');

        if (!response.ok) {
          throw new Error('Nie udało się pobrać statystyk');
        }

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Wystąpił błąd');
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalStats();
  }, []);

  if (loading) {
    return <StatsSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-red-600">
          <p className="font-medium">Błąd ładowania statystyk</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Main Statistics */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Statystyki Platformy
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.total_users.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Aktywnych użytkowników</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {stats.total_catches.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Połowów ogółem</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {stats.total_species_caught}
            </div>
            <div className="text-sm text-gray-600">Gatunków ryb</div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {stats.total_lakes_with_catches}
            </div>
            <div className="text-sm text-gray-600">Aktywnych jezior</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Ostatnia aktywność
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold text-blue-500">
              {stats.recent_activity.catches_last_24h}
            </div>
            <div className="text-sm text-gray-600">Połowy (24h)</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-green-500">
              {stats.recent_activity.catches_last_7d}
            </div>
            <div className="text-sm text-gray-600">Połowy (7 dni)</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-purple-500">
              {stats.recent_activity.catches_last_30d}
            </div>
            <div className="text-sm text-gray-600">Połowy (30 dni)</div>
          </div>

          <div>
            <div className="text-2xl font-bold text-indigo-500">
              {stats.recent_activity.new_users_last_30d}
            </div>
            <div className="text-sm text-gray-600">
              Nowi użytkownicy (30 dni)
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Most Popular Species */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Najpopularniejsze gatunki
          </h3>

          <div className="space-y-3">
            {stats.most_popular_species.map((species, index) => (
              <div
                key={species.species}
                className="flex justify-between items-center text-gray-600"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      index === 0
                        ? 'bg-yellow-500'
                        : index === 1
                        ? 'bg-gray-400'
                        : index === 2
                        ? 'bg-orange-500'
                        : 'bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="font-medium capitalize">
                    {species.species}
                  </span>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    {species.catch_count.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {species.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Active Lakes */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Najbardziej aktywne jeziora
          </h3>

          <div className="space-y-3 text-gray-600">
            {stats.most_active_lakes.map((lake, index) => (
              <div
                key={lake.lake_id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      index === 0
                        ? 'bg-blue-500'
                        : index === 1
                        ? 'bg-blue-400'
                        : index === 2
                        ? 'bg-blue-300'
                        : 'bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="font-medium">{lake.lake_id}</span>
                </div>

                <div className="text-right">
                  <div className="font-semibold">
                    {lake.catch_count} połowów
                  </div>
                  <div className="text-sm text-gray-600">
                    {lake.unique_anglers} wędkarzy
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Biggest Fish */}
      {stats.biggest_fish && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200 p-6 text-gray-600">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="text-2xl mr-2">🏆</span>
            Największa ryba na platformie
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Gatunek</div>
              <div className="font-semibold capitalize text-lg">
                {stats.biggest_fish.species}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Waga / Długość</div>
              <div className="font-semibold text-lg">
                {stats.biggest_fish.weight}kg / {stats.biggest_fish.length}cm
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Złowiona przez</div>
              <div className="font-semibold text-lg">
                {stats.biggest_fish.caught_by}
              </div>
              <div className="text-sm text-gray-600">
                {new Date(stats.biggest_fish.date).toLocaleDateString('pl-PL')}{' '}
                · {stats.biggest_fish.lake}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
