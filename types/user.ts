// TypeScript types for user authentication and management

export type User = {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_picture_url?: string;
  email_verified: boolean;
  is_active: boolean;
  preferred_units: "metric" | "imperial";
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
  preferred_units?: "metric" | "imperial";
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
  id: number;
  username: string;
  email: string;
  total_catches: number;
  lakes_visited: number;
  species_caught: number;
  avg_weight: number;
  avg_length: number;
  biggest_fish_weight: number;
  longest_fish_length: number;
  first_catch_date?: string;
  last_catch_date?: string;
};

export type UpdateUserProfile = {
  first_name?: string;
  last_name?: string;
  preferred_units?: "metric" | "imperial";
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
