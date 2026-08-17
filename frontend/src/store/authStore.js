import { create } from 'zustand';
import { authService } from '../services/auth.service';

/**
 * Auth Store (Zustand)
 * In-memory store holding user session state verified via HTTP-only cookie.
 */
export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitializing: true,

  setAuth: (user) => set({ user, isAuthenticated: true, isInitializing: false }),

  logoutState: () => set({ user: null, isAuthenticated: false, isInitializing: false }),

  checkAuth: async () => {
    try {
      set({ isInitializing: true });
      const response = await authService.getMe();
      const user = response.data?.data?.user;
      if (user) {
        set({ user, isAuthenticated: true, isInitializing: false });
      } else {
        set({ user: null, isAuthenticated: false, isInitializing: false });
      }
    } catch (err) {
      set({ user: null, isAuthenticated: false, isInitializing: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Ignore logout backend errors and clear local state
    } finally {
      get().logoutState();
    }
  },
}));
