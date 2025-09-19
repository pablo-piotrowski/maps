import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  loginUser,
  registerUser,
  logout,
  clearError,
} from "../store/authSlice";
import { useCallback } from "react";

export const useReduxAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isLoading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await dispatch(loginUser({ email, password }));
      return result.meta.requestStatus === "fulfilled";
    },
    [dispatch]
  );

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const result = await dispatch(
        registerUser({ username, email, password })
      );
      return result.meta.requestStatus === "fulfilled";
    },
    [dispatch]
  );

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    token,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout: logoutUser,
    clearError: clearAuthError,
  };
};
