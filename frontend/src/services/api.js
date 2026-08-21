import axios from 'axios';
import { useAuthStore } from '../store/authStore';

/**
 * Axios instance configured with base URL and cross-site HTTP-only cookie credentials.
 */
const getBaseURL = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl || backendUrl === '') {
    return '/api';
  }
  return backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
