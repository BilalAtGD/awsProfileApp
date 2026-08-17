import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileHeader from '../organisms/ProfileHeader';
import ProfileForm from '../organisms/ProfileForm';
import Button from '../atoms/Button';
import { useAuth } from '../hooks/useAuth';
import { useProfile } from '../hooks/useProfile';

/**
 * PAGE: ProfilePage
 * Pure Tailwind CSS Page using Custom Hooks (useAuth & useProfile) for complete separation of UI & Data logic.
 */
const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile, avatarUrl, loading, error, fetchProfile, clearProfile } = useProfile();

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile().catch(() => {});
  }, [fetchProfile]);

  const handleLogout = async () => {
    await logout();
    clearProfile();
    navigate('/auth', { replace: true });
  };

  const handleSaveSuccess = () => {
    setIsEditing(false);
  };

  const displayEmail = profile?.email || user?.email || '';

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 flex flex-col font-sans">

      {/* ── Persistent Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#060b18]/90 backdrop-blur-xl py-3.5">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10 flex items-center justify-between">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/profile')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 flex items-center justify-center shadow-lg shadow-violet-500/20 shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-base font-bold bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent tracking-wide block leading-tight">ProfileApp</span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase block mt-0.5">User Portal</span>
            </div>
          </div>

          {/* Right Status */}
          <div className="flex items-center gap-4">
            {displayEmail && (
              <span className="hidden sm:inline-block text-xs font-mono text-slate-300 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full">
                {displayEmail}
              </span>
            )}
            <span className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </header>

      {/* ── Main Content Container ── */}
      <main className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10 py-8 sm:py-10 flex-1 w-full">

        {/* ── Loading Skeleton State ── */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start animate-pulse">
            {/* Sidebar Skeleton */}
            <div className="bg-[#0d1428]/95 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-6">
              <div className="w-22 h-22 rounded-full bg-white/10 mt-2" />
              <div className="w-full flex flex-col items-center gap-2">
                <div className="h-6 w-3/4 bg-white/10 rounded-lg" />
                <div className="h-4 w-1/2 bg-white/10 rounded-lg" />
              </div>
              <div className="w-full space-y-3 pt-5 border-t border-white/10">
                <div className="h-12 w-full bg-white/10 rounded-xl" />
                <div className="h-12 w-full bg-white/10 rounded-xl" />
              </div>
            </div>

            {/* Main Panel Skeleton */}
            <div className="bg-[#0d1428]/95 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="pb-4 border-b border-white/10 space-y-2">
                <div className="h-7 w-48 bg-white/10 rounded-lg" />
                <div className="h-4 w-64 bg-white/10 rounded-lg" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="h-28 w-full bg-white/10 rounded-2xl" />
                <div className="h-28 w-full bg-white/10 rounded-2xl" />
                <div className="h-28 w-full bg-white/10 rounded-2xl" />
                <div className="h-28 w-full bg-white/10 rounded-2xl" />
              </div>
            </div>
          </div>
        )}

        {/* ── Failed Error Retry State ── */}
        {!loading && error && (
          <div className="flex items-center justify-center min-h-[55vh] p-4">
            <div className="w-full max-w-md bg-[#0d1428]/95 backdrop-blur-2xl border border-red-500/30 rounded-2xl p-8 sm:p-10 flex flex-col items-center text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-2xl bg-red-500/12 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-100 tracking-tight">Unable to Load Profile</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-xs mx-auto">{error}</p>
              </div>

              <div className="w-full grid grid-cols-2 gap-3 pt-5 border-t border-white/10">
                <Button variant="secondary" fullWidth onClick={handleLogout}>
                  Sign Out
                </Button>
                <Button variant="primary" fullWidth onClick={fetchProfile}>
                  <svg className="w-4 h-4 mr-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── Ready Profile State ── */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">

            {/* Sidebar Column */}
            <div className="md:sticky md:top-24">
              <ProfileHeader
                profile={profile}
                avatarUrl={avatarUrl}
                isEditing={isEditing}
                onToggleEdit={() => setIsEditing(v => !v)}
                onLogout={handleLogout}
              />
            </div>

            {/* Main Details Panel Column */}
            <div className="w-full bg-[#0d1428]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl">
              <ProfileForm
                isEditing={isEditing}
                onSaveSuccess={handleSaveSuccess}
                onCancelEdit={() => setIsEditing(false)}
              />
            </div>

          </div>
        )}

      </main>
    </div>
  );
};

export default ProfilePage;
