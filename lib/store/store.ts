import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import mapUiReducer from './mapUiSlice';
import { loadMapUiPreloaded, mapUiPersistMiddleware } from './persist';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mapUi: mapUiReducer,
  },
  preloadedState: loadMapUiPreloaded(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(mapUiPersistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
