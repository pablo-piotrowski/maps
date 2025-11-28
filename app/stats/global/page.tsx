'use client';

import GlobalStats from '@/components/global-stats';
import MapHeader from '@/components/map-header';
import Link from 'next/link';
import { useReduxAuth } from '@/lib/hooks/useReduxAuth';

export default function GlobalStatsPage() {
  const { isAuthenticated } = useReduxAuth();
  return (
    <div className="min-h-screen bg-gray-50">
      <MapHeader />

      <div className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="mb-4">
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
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Statystyki Platformy
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Sprawdź globalne statystyki naszej społeczności wędkarskiej.
              Wszystkie dane są aktualizowane w czasie rzeczywistym.
            </p>
          </div>

          <GlobalStats />

          {!isAuthenticated && (
            <div className="mt-12 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Chcesz być częścią społeczności?
                </h3>
                <p className="text-blue-700 mb-4">
                  Dołącz do nas i zacznij śledzić swoje połowy, odkrywać nowe
                  miejsca i dzielić się sukcesami!
                </p>
                <div className="space-x-4">
                  <a
                    href="/register"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Zarejestruj się
                  </a>
                  <a
                    href="/login"
                    className="inline-flex items-center px-6 py-3 border border-blue-300 text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                  >
                    Zaloguj się
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
