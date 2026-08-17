import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/index';
import { useAuthStore } from './store/authStore';
import Spinner from './atoms/Spinner';
import './index.css';

/**
 * Root App Component
 * Initializes cookie authentication session on mount.
 */
function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#060b18] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
