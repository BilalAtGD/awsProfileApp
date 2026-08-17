import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * Axios instance configured with base URL and cross-site HTTP-only cookie credentials.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Mandatory for sending/receiving cross-site HTTP-only cookies
  timeout: 15000,
});

// ─── Response Interceptor — Handle 401 ────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired or invalid — clear store state if on protected route
      const { isAuthenticated, logoutState } = useAuthStore.getState();
      if (isAuthenticated) {
        logoutState();
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
