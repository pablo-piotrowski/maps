'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useReduxAuth } from '@/lib/hooks/useReduxAuth';
import MapHeader from '@/components/map-header';
import StatsSkeleton from '@/components/stats-skeleton';
import type { UserStats } from '@/types/user';

// Reusable components
const BackToMapLink = () => (
  <Link
    href="/"
    className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
  >
    <svg
      className="w-4 h-4 mr-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Strzałka powrotu"
    >
      <title>Strzałka powrotu</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 19l-7-7m0 0l7-7m-7 7h18"
      />
    </svg>
    Powrót do mapy
  </Link>
);

const StatsPageLayout = ({
  children,
  title = 'Statystyki Wędkarskie',
  subtitle,
  isSimple = false,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  isSimple?: boolean;
}) => {
  const header = (
    <div className="mb-8 text-center">
      <div className="mb-4">
        <BackToMapLink />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );

  if (isSimple) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            {header}
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MapHeader />
      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {header}
          {children}
        </div>
      </div>
    </div>
  );
};

const ErrorMessage = ({ error }: { error: string }) => (
  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    {error}
  </div>
);

export default function StatsPage() {
  const { token, isAuthenticated, isLoading } = useReduxAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch stats function
  const fetchStats = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/user/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Nie udało się pobrać statystyk');
      }

      const result = await response.json();
      setStats(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Fetch stats when user is authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchStats();
    }
  }, [isAuthenticated, token, fetchStats]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <StatsPageLayout title="Statystyki Wędkarskie">
        <StatsSkeleton />
      </StatsPageLayout>
    );
  }

  if (error) {
    return (
      <StatsPageLayout title="Statystyki Wędkarskie" isSimple>
        <ErrorMessage error={error} />
      </StatsPageLayout>
    );
  }

  if (!stats) {
    return (
      <StatsPageLayout title="Statystyki Wędkarskie" isSimple>
        <p className="text-gray-600 mb-4">Brak danych do wyświetlenia</p>
      </StatsPageLayout>
    );
  }

  return (
    <StatsPageLayout
      title="Statystyki Wędkarskie"
      subtitle={`Twoje wyniki połowów, ${stats.overview.username}`}
    >
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Łączne połowy</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.overview.total_catches}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Odwiedzone jeziora
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {stats.overview.lakes_visited}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Gatunki ryb</h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats.overview.species_caught}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Średnia waga</h3>
          <p className="text-3xl font-bold text-orange-600">
            {stats.overview.avg_weight} kg
          </p>
        </div>
      </div>

      {/* Personal Records */}
      {(stats.overview.biggest_fish_weight ||
        stats.overview.longest_fish_length) && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Rekordy Osobiste
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.overview.biggest_fish_weight && (
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">
                  Najcięższa ryba
                </h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.overview.biggest_fish_weight} kg
                </p>
              </div>
            )}

            {stats.overview.longest_fish_length && (
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">
                  Najdłuższa ryba
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.overview.longest_fish_length} cm
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Species Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Gatunki Ryb</h2>
          {stats.species_breakdown.length > 0 ? (
            <div className="space-y-4">
              {stats.species_breakdown.map((species) => (
                <div
                  key={species.species}
                  className="border-l-4 border-blue-500 pl-4"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">
                      {species.species}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {species.count} szt.
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Śr. waga: {parseFloat(species.avg_weight).toFixed(2)} kg |
                    Śr. długość: {parseFloat(species.avg_length).toFixed(1)} cm
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Brak danych o gatunkach</p>
          )}
        </div>

        {/* Favorite Lakes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Ulubione Jeziora
          </h2>
          {stats.favorite_lakes.length > 0 ? (
            <div className="space-y-4">
              {stats.favorite_lakes.map((lake, index) => (
                <div
                  key={lake.lake_id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      #{index + 1} {lake.lake_id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ostatnia wizyta:{' '}
                      {new Date(lake.last_visit).toLocaleDateString('pl-PL')}
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-blue-600">
                    {lake.catch_count} połowów
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Brak danych o jeziorach</p>
          )}
        </div>
      </div>

      {/* Recent Catches */}
      {stats.recent_catches.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Ostatnie Połowy
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ryba
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rozmiar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jezioro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recent_catches.map((catch_) => (
                  <tr key={catch_.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {catch_.fish}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {catch_.length && catch_.weight ? (
                        <div>
                          {catch_.length}cm / {catch_.weight}kg
                        </div>
                      ) : catch_.length ? (
                        `${catch_.length}cm`
                      ) : catch_.weight ? (
                        `${catch_.weight}kg`
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {catch_.lake_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>
                        {new Date(catch_.date).toLocaleDateString('pl-PL')}
                      </div>
                      <div className="text-xs text-gray-400">{catch_.time}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Activity Timeline */}
      {stats.overview.first_catch_date && (
        <div className="bg-white p-6 rounded-lg shadow mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aktywność</h2>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              <span className="font-medium">Pierwszy połów:</span>{' '}
              {new Date(stats.overview.first_catch_date).toLocaleDateString(
                'pl-PL'
              )}
            </div>
            {stats.overview.last_catch_date && (
              <div>
                <span className="font-medium">Ostatni połów:</span>{' '}
                {new Date(stats.overview.last_catch_date).toLocaleDateString(
                  'pl-PL'
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </StatsPageLayout>
  );
}
