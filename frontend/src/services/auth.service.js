import api from './api';

export const authService = {
  googleAuth: (credential) => api.post('/auth/google', { credential }),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};
