"use client";

import { useReduxAuth } from "@/lib/hooks/useReduxAuth";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";

export default function MapHeader() {
  const { user, logout } = useReduxAuth();
  const router = useRouter();

  const handleLogout = useCallback(() => {
    logout();
    router.push("/");
  }, [logout, router]);

  return (
    <div className="absolute top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-800">Mapa Wędkarska</h1>
          {user && (
            <span className="text-gray-600">Witaj, {user.username}!</span>
          )}
        </div>

        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Wyloguj
          </button>
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
