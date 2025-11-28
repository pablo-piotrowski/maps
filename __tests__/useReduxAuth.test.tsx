import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import { useReduxAuth } from '../lib/hooks/useReduxAuth';
import authReducer from '../lib/store/authSlice';

// Mock fetch
global.fetch = vi.fn();

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,
        ...initialState,
      },
    },
  });
};

const createWrapper = (store: ReturnType<typeof createMockStore>) => {
  return ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
};

describe('useReduxAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial auth state', () => {
    const store = createMockStore();
    const wrapper = createWrapper(store);

    const { result } = renderHook(() => useReduxAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should return authenticated state when user is logged in', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: '2024-01-01T00:00:00Z',
      isActive: true,
    };

    const store = createMockStore({
      user: mockUser,
      token: 'mock-token',
      isAuthenticated: true,
    });
    const wrapper = createWrapper(store);

    const { result } = renderHook(() => useReduxAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('mock-token');
  });

  it('should handle successful login', async () => {
    const mockResponse = {
      token: 'new-token',
      user: {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: '2024-01-01T00:00:00Z',
        isActive: true,
      },
    };

    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const store = createMockStore();
    const wrapper = createWrapper(store);

    const { result } = renderHook(() => useReduxAuth(), { wrapper });

    await act(async () => {
      const success = await result.current.login(
        'test@example.com',
        'password123'
      );
      expect(success).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockResponse.user);
  });

  it('should handle login failure', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Invalid credentials' }),
    } as Response);

    const store = createMockStore();
    const wrapper = createWrapper(store);

    const { result } = renderHook(() => useReduxAuth(), { wrapper });

    await act(async () => {
      const success = await result.current.login(
        'test@example.com',
        'wrongpassword'
      );
      expect(success).toBe(false);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe('Invalid credentials');
  });

  it('should handle logout', () => {
    const store = createMockStore({
      user: { id: 1, username: 'testuser' },
      token: 'token',
      isAuthenticated: true,
    });
    const wrapper = createWrapper(store);

    const { result } = renderHook(() => useReduxAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });

  it('should clear error', () => {
    const store = createMockStore({
      error: 'Some error',
    });
    const wrapper = createWrapper(store);

    const { result } = renderHook(() => useReduxAuth(), { wrapper });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
