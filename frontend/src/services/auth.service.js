import api from './api';

export const authService = {
  googleAuth: (credential) => api.post('/api/auth/google', { credential }),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me'),
};
