'use client';

import React from 'react';
import { useReduxAuth } from '@/lib/hooks/useReduxAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import Link from 'next/link';

export default function MapHeader() {
  const { user, logout } = useReduxAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = useCallback(() => {
    logout();
    router.push('/');
  }, [logout, router]);

  const isStatsPage = pathname === '/stats';

  return (
    <div className="absolute top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-baseline space-x-4">
          <h1 className="text-xl font-bold text-gray-800">Mapa Wędkarska</h1>
          {user && (
            <span className="text-gray-600">Witaj, {user.username}!</span>
          )}
        </div>

        {user ? (
          <div className="flex space-x-2">
            {isStatsPage ? (
              <Link
                href="/"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Powrót do mapy
              </Link>
            ) : (
              <Link
                href="/stats"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Statystyki
              </Link>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Wyloguj
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Zaloguj się
            </Link>
            <Link
              href="/register"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Zarejestruj się
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
