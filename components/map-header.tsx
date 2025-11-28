'use client';

import React, { useCallback } from 'react';
import { useReduxAuth } from '@/lib/hooks/useReduxAuth';
import { useRouter, usePathname } from 'next/navigation';
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
        <div className="flex flex-col md:flex-row md:items-baseline text-center md:text-left space-y-1 md:space-y-0 md:space-x-4">
          <h1 className="text-xl font-bold text-gray-800">Mapa Wędkarska</h1>
          {user && (
            <span className="text-gray-600">Witaj, {user.username}!</span>
          )}
        </div>

        {user ? (
          <div className="flex flex-wrap gap-2 justify-center md:justify-end items-center">
            <Link
              href="/stats"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
            >
              Moje statystyki
            </Link>

            <Link
              href="/stats/global"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
            >
              Globalne statystyki
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
            >
              Wyloguj
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 justify-center md:justify-end items-center">
            <Link
              href="/stats/global"
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
            >
              Statystyki platformy
            </Link>
            <Link
              href="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
            >
              Zaloguj się
            </Link>
            <Link
              href="/register"
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors text-center"
            >
              Zarejestruj się
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
