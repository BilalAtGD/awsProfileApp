import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import ProfilePage from '../pages/ProfilePage';
import PrivateRoute from '../guards/PrivateRoute';
import PublicRoute from '../guards/PublicRoute';
import { ROUTES } from '../constants/routes.constants';

/**
 * Application Router
 * Defines centralized application routes using ROUTES constants and route guards.
 */
const AppRouter = () => {
  return (
    <Routes>
      {/* Root → auth */}
      <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.AUTH} replace />} />

      {/* Auth route */}
      <Route
        path={ROUTES.AUTH}
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />

      {/* Profile route */}
      <Route
        path={ROUTES.PROFILE}
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to={ROUTES.AUTH} replace />} />
    </Routes>
  );
};

export default AppRouter;
