import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import AlertMessage from '../molecules/AlertMessage';
import Spinner from '../atoms/Spinner';

/**
 * ORGANISM: AuthCard
 * Pure Tailwind CSS implementation.
 * Provides Google OAuth 2.0 Sign-In interface using useAuth hook.
 */
const AuthCard = ({ onAuthSuccess }) => {
  const { loginWithGoogle, loading, error, clearError } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        throw new Error('Google did not return a valid credential token');
      }
      await loginWithGoogle(credentialResponse.credential);
      if (onAuthSuccess) {
        onAuthSuccess();
      }
    } catch (err) {
      console.error('Google Auth Error:', err);
    }
  };

  const handleGoogleError = () => {
    console.error('Google Sign-In failed or was closed');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#0d1428]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-6 sm:p-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30 mx-auto mb-4">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight">
          Welcome to ProfileApp
        </h2>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-xs mx-auto">
          Sign in or create your account instantly using your Google credentials.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6">
          <AlertMessage type="error" message={error} onClose={clearError} />
        </div>
      )}

      {/* Google Login Section */}
      <div className="flex flex-col items-center justify-center gap-4 py-2">
        {loading ? (
          <div className="py-4 flex items-center gap-3 text-sm text-violet-300">
            <Spinner size="md" />
            <span>Authenticating with Google...</span>
          </div>
        ) : (
          <div className="w-full flex justify-center py-2">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              size="large"
              width="360"
              shape="pill"
              text="continue_with"
              logo_alignment="left"
            />
          </div>
        )}
      </div>

      {/* Security Note */}
      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Protected by HTTP-Only Cookie Authentication & SSL
        </p>
      </div>

    </div>
  );
};

export default AuthCard;
