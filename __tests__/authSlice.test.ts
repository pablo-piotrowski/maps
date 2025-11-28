import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  loginUser,
  registerUser,
  verifyToken,
  logout,
  clearError,
  type User,
} from '../lib/store/authSlice';
import type { AuthState } from '../types/auth';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('authSlice', () => {
  type TestStore = ReturnType<typeof configureStore<{ auth: AuthState }>>;
  let store: TestStore;

  beforeEach(() => {
    vi.clearAllMocks();
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = (store.getState() as { auth: AuthState }).auth;
      expect(state).toEqual({
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
      });
    });
  });

  describe('synchronous actions', () => {
    it('should handle logout', () => {
      store.dispatch(logout());
      const state = (store.getState() as { auth: AuthState }).auth;

      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });

    it('should handle clearError', () => {
      store.dispatch(clearError());
      const state = (store.getState() as { auth: AuthState }).auth;

      expect(state.error).toBeNull();
    });
  });

  describe('loginUser async thunk', () => {
    const mockUser: User = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: '2024-01-01T00:00:00Z',
      isActive: true,
    };

    it('should handle successful login', async () => {
      const mockResponse = {
        token: 'mock-token',
        user: mockUser,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await store.dispatch(
        loginUser({ email: 'test@example.com', password: 'password123' })
      );
      const state = (store.getState() as { auth: AuthState }).auth;

      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('mock-token');
      expect(state.error).toBeNull();
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'token',
        'mock-token'
      );
    });

    it('should handle login failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid credentials' }),
      } as Response);

      await store.dispatch(
        loginUser({ email: 'test@example.com', password: 'wrongpassword' })
      );
      const state = (store.getState() as { auth: AuthState }).auth;

      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.error).toBe('Invalid credentials');
    });

    it('should handle network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await store.dispatch(
        loginUser({ email: 'test@example.com', password: 'password123' })
      );
      const state = (store.getState() as { auth: AuthState }).auth;

      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('Wystąpił błąd sieci');
    });
  });

  describe('registerUser async thunk', () => {
    const mockUser: User = {
      id: 2,
      username: 'newuser',
      email: 'new@example.com',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: '2024-01-01T00:00:00Z',
      isActive: true,
    };

    it('should handle successful registration', async () => {
      const mockResponse = {
        token: 'new-token',
        user: mockUser,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await store.dispatch(
        registerUser({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123',
        })
      );
      const state = (store.getState() as { auth: AuthState }).auth;

      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('new-token');
      expect(state.error).toBeNull();
    });

    it('should handle registration failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'User already exists' }),
      } as Response);

      await store.dispatch(
        registerUser({
          username: 'newuser',
          email: 'existing@example.com',
          password: 'password123',
        })
      );
      const state = (store.getState() as { auth: AuthState }).auth;

      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBe('User already exists');
    });
  });

  describe('verifyToken async thunk', () => {
    it('should handle successful token verification', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: '2024-01-01T00:00:00Z',
        isActive: true,
      };

      localStorageMock.getItem.mockReturnValue('valid-token');
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user: mockUser }),
      } as Response);

      await store.dispatch(verifyToken());
      const state = (store.getState() as { auth: AuthState }).auth;

      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('valid-token');
    });

    it('should handle no token in localStorage', async () => {
      localStorageMock.getItem.mockReturnValue(null);

      await store.dispatch(verifyToken());
      const state = store.getState().auth;

      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });

    it('should handle invalid token', async () => {
      localStorageMock.getItem.mockReturnValue('invalid-token');
      mockFetch.mockResolvedValueOnce({
        ok: false,
      } as Response);

      await store.dispatch(verifyToken());
      const state = (store.getState() as { auth: AuthState }).auth;

      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    });
  });
});
