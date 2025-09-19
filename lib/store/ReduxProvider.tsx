"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";
import { verifyToken } from "./authSlice";

interface ReduxProviderProps {
  children: React.ReactNode;
}

function AuthInitializer() {
  useEffect(() => {
    // Verify token on app startup
    store.dispatch(verifyToken());
  }, []);

  return null;
}

export default function ReduxProvider({ children }: ReduxProviderProps) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      {children}
    </Provider>
  );
}
