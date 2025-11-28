import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';
import MapHeader from '../components/map-header';
import authReducer from '../lib/store/authSlice';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => '/',
}));

const createMockStore = (authState = {}) => {
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
        ...authState,
      },
    },
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  store: ReturnType<typeof createMockStore>
) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('MapHeader', () => {
  it('should render title', () => {
    const store = createMockStore();
    renderWithProviders(<MapHeader />, store);

    expect(screen.getByText('Mapa Wędkarska')).toBeInTheDocument();
  });

  it('should show login/register buttons when not authenticated', () => {
    const store = createMockStore({ isAuthenticated: false });
    renderWithProviders(<MapHeader />, store);

    expect(screen.getByText('Statystyki platformy')).toBeInTheDocument();
    expect(screen.getByText('Zaloguj się')).toBeInTheDocument();
    expect(screen.getByText('Zarejestruj się')).toBeInTheDocument();
    expect(screen.queryByText('Wyloguj')).not.toBeInTheDocument();
  });

  it('should show user info and stats/logout buttons when authenticated', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: '2024-01-01T00:00:00Z',
      isActive: true,
    };

    const store = createMockStore({
      isAuthenticated: true,
      user: mockUser,
    });

    renderWithProviders(<MapHeader />, store);

    expect(screen.getByText('Witaj, testuser!')).toBeInTheDocument();
    expect(screen.getByText('Moje statystyki')).toBeInTheDocument();
    expect(screen.getByText('Globalne statystyki')).toBeInTheDocument();
    expect(screen.getByText('Wyloguj')).toBeInTheDocument();
    expect(screen.queryByText('Zaloguj się')).not.toBeInTheDocument();
  });
});
