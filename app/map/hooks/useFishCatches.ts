import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { FishCatch } from "@/types/fish-catch";

export const useFishCatches = () => {
  const [lakeCatches, setLakeCatches] = useState<FishCatch[]>([]);
  const [isLoadingCatches, setIsLoadingCatches] = useState(false);
  const { token, user } = useAuth();

  const fetchLakeCatches = useCallback(
    async (lakeId: string) => {
      if (!token) return;

      setIsLoadingCatches(true);
      try {
        const response = await fetch(
          `/api/fish-catch?lake_id=${encodeURIComponent(lakeId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
          console.error("API Error:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch lake catches:", error);
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
  };
};
