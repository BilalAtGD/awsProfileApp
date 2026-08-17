import { useState, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';

/**
 * Custom Hook: useAuth
 * Encapsulates authentication state, Google OAuth login flow, and logout actions.
 * UI components consume this hook rather than directly importing backend API services.
 */
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const setAuth = useAuthStore((state) => state.setAuth);
  const storeLogout = useAuthStore((state) => state.logout);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginWithGoogle = useCallback(async (credentialToken) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.googleAuth(credentialToken);
      const user = response.data?.data?.user;
      if (user) {
        setAuth(user);
        return user;
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Google Sign-In failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, [setAuth]);

  const logout = useCallback(async () => {
    await storeLogout();
  }, [storeLogout]);

  return {
    user,
    isAuthenticated,
    isInitializing,
    loading,
    error,
    loginWithGoogle,
    logout,
    checkAuth,
    clearError: () => setError(null),
  };
};
