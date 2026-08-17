import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants/routes.constants';

/**
 * PublicRoute Guard
 * If authenticated → redirect to ROUTES.PROFILE
 * If unauthenticated → render public children
 */
const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate to={ROUTES.PROFILE} replace /> : children;
};

export default PublicRoute;
