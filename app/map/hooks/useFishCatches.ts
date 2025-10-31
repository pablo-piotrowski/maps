import { useState, useCallback } from 'react';
import { useReduxAuth } from '@/lib/hooks/useReduxAuth';
import type { FishCatch } from '@/types/fish-catch';

export const useFishCatches = () => {
  const [lakeCatches, setLakeCatches] = useState<FishCatch[]>([]);
  const [isLoadingCatches, setIsLoadingCatches] = useState(false);
  const { token, user } = useReduxAuth();

  const fetchLakeCatches = useCallback(
    async (lakeId: string) => {
      setIsLoadingCatches(true);
      try {
        const headers: Record<string, string> = {};

        // Add authorization header only if token exists
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(
          `/api/fish-catch?lake_id=${encodeURIComponent(lakeId)}`,
          { headers }
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            // Sort catches: current user first, then others
            const sortedCatches = result.data.sort(
              (a: FishCatch, b: FishCatch) => {
                // Current user's catches first
                if (user && a.user_id === user.id && b.user_id !== user.id)
                  return -1;
                if (user && b.user_id === user.id && a.user_id !== user.id)
                  return 1;
                // Then sort by date/time descending
                return (
                  new Date(`${b.date} ${b.time}`).getTime() -
                  new Date(`${a.date} ${a.time}`).getTime()
                );
              }
            );
            setLakeCatches(sortedCatches);
          }
        } else {
          console.error('API Error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch lake catches:', error);
      } finally {
        setIsLoadingCatches(false);
      }
    },
    [token, user]
  );

  return {
    lakeCatches,
    isLoadingCatches,
    fetchLakeCatches,
    clearLakeCatches: () => setLakeCatches([]),
  };
};
