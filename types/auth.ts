// Authentication and authorization related types

import type { User } from './user';

// Re-export User type for convenience
export type { User } from './user';

export type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

export type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
};

// Thunk action payload types
export type LoginResponse = {
  token: string;
  user: User;
};

export type RegisterResponse = {
  token: string;
  user: User;
};

export type VerifyTokenResponse = {
  token: string;
  user: User;
};

// Async thunk credentials
export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = {
  username: string;
  email: string;
  password: string;
};
