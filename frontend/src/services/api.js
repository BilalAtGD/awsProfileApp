import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * Axios instance configured with base URL and cross-site HTTP-only cookie credentials.
 * In Production (Vercel), default baseURL is empty string '' so relative paths like /api/auth/google
 * are proxied cleanly by Vercel to EC2 without double /api/ prefixes or Mixed Content errors.
 */
const baseURL = import.meta.env.VITE_API_URL !== undefined && import.meta.env.VITE_API_URL !== ''
  ? import.meta.env.VITE_API_URL 
  : (import.meta.env.PROD ? '' : 'http://localhost:5000');

const api = axios.create({
  baseURL: baseURL,
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
