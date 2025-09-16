// TypeScript types for the fish_catches table

export type FishCatch = {
  id: number;
  lake_id: string;
  fish: string;
  length: number | null;
  weight: number | null;
  date: string; // Date string in YYYY-MM-DD format
  time: string; // Time string in HH:MM:SS format
  created_at: string;
  updated_at: string;
};

export type CreateFishCatch = {
  lake_id: string;
  fish: string;
  length?: number | null;
  weight?: number | null;
  date: string;
  time: string;
};

export type UpdateFishCatch = {
  lake_id?: string;
  fish?: string;
  length?: number | null;
  weight?: number | null;
  date?: string;
  time?: string;
};

// Utility type for API responses
export type FishCatchResponse = {
  success: boolean;
  data?: FishCatch | FishCatch[];
  error?: string;
};
