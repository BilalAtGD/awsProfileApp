import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ROUTES } from '../constants/routes.constants';

/**
 * PrivateRoute Guard
 * If unauthenticated → redirect to ROUTES.AUTH
 * If authenticated → render protected children
 */
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to={ROUTES.AUTH} replace />;
};

export default PrivateRoute;
