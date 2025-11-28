import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  User,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
} from '../../types/auth';

// Re-export User type for compatibility
export type { User } from '../../types/auth';

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error || 'Logowanie nie powiodło się');
      }

      const data = await response.json();

      // Store token in localStorage
      localStorage.setItem('token', data.token);

      return { token: data.token, user: data.user };
    } catch {
      return rejectWithValue('Wystąpił błąd sieci');
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.error || 'Rejestracja nie powiodła się'
        );
      }

      const data = await response.json();

      // Store token in localStorage
      localStorage.setItem('token', data.token);

      return { token: data.token, user: data.user };
    } catch {
      return rejectWithValue('Wystąpił błąd sieci');
    }
  }
);

// Async thunk for verifying token
export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        return rejectWithValue('Brak tokenu');
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem('token');
        return rejectWithValue('Token nieprawidłowy');
      }

      const data = await response.json();

      return { token, user: data.user };
    } catch {
      localStorage.removeItem('token');
      return rejectWithValue('Weryfikacja tokenu nie powiodła się');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.error = null;
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.error = null;
        }
      )
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })

      // Token verification cases
      .addCase(verifyToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        verifyToken.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User }>) => {
          state.isLoading = false;
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.error = null;
        }
      )
      .addCase(verifyToken.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = null; // Don't show error for token verification failures
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
