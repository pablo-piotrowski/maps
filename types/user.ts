// TypeScript types for user authentication and management

// Main User type (used in auth state - simplified version)
export type User = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
};

// Extended User type (full database model)
export type ExtendedUser = {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string;
  email_verified: boolean;
  is_active: boolean;
  preferred_units: 'metric' | 'imperial';
  privacy_settings: {
    profile_public: boolean;
    catches_public: boolean;
  };
  created_at: string;
  updated_at: string;
  last_login?: string;
};

export type CreateUser = {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  preferred_units?: 'metric' | 'imperial';
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  first_name?: string;
  last_name?: string;
};

export type AuthResponse = {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  message?: string;
};

export type UserSession = {
  id: number;
  user_id: number;
  session_token: string;
  refresh_token?: string;
  expires_at: string;
  created_at: string;
  last_accessed: string;
  ip_address?: string;
  user_agent?: string;
};

export type UserStats = {
  overview: {
    username: string;
    total_catches: number;
    lakes_visited: number;
    species_caught: number;
    avg_weight: string;
    avg_length: string;
    biggest_fish_weight: number | null;
    longest_fish_length: number | null;
    first_catch_date: string | null;
    last_catch_date: string | null;
  };
  recent_catches: Array<{
    id: number;
    fish: string;
    length: number | null;
    weight: number | null;
    date: string;
    time: string;
    lake_id: string;
  }>;
  favorite_lakes: Array<{
    lake_id: string;
    catch_count: number;
    last_visit: string;
  }>;
  species_breakdown: Array<{
    species: string;
    count: number;
    avg_length: string;
    avg_weight: string;
    biggest_weight: number | null;
    longest_length: number | null;
  }>;
};

// Global platform statistics (available for all users)
export type PlatformStats = {
  total_users: number;
  total_catches: number;
  total_species_caught: number;
  total_lakes_with_catches: number;
  biggest_fish: {
    species: string;
    weight: number;
    length: number;
    caught_by: string;
    date: string;
    lake: string;
  } | null;
  most_popular_species: Array<{
    species: string;
    catch_count: number;
    percentage: number;
  }>;
  most_active_lakes: Array<{
    lake_id: string;
    catch_count: number;
    unique_anglers: number;
  }>;
  recent_activity: {
    catches_last_24h: number;
    catches_last_7d: number;
    catches_last_30d: number;
    new_users_last_30d: number;
  };
};

export type UpdateUserProfile = {
  first_name?: string;
  last_name?: string;
  preferred_units?: 'metric' | 'imperial';
  privacy_settings?: {
    profile_public?: boolean;
    catches_public?: boolean;
  };
};

export type ChangePassword = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// Form validation types
export type LoginFormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export type RegisterFormErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

// JWT payload type
export type JWTPayload = {
  sub: string; // user ID
  email: string;
  username: string;
  iat: number;
  exp: number;
};
