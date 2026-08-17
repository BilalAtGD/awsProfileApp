import { create } from 'zustand';

/**
 * Profile Store (Zustand)
 * In-memory store for the current user's profile data.
 * NOT persisted — fetched fresh from the API on page load.
 */
export const useProfileStore = create((set) => ({
  profile: null,
  avatarUrl: null,    // presigned GET URL for the profile picture
  loading: false,
  error: null,

  setProfile: (profile) => set({ profile }),
  setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearProfile: () => set({ profile: null, avatarUrl: null }),
}));
