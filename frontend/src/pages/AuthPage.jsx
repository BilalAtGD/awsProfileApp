import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../organisms/AuthCard';
import { ROUTES } from '../constants/routes.constants';

/**
 * PAGE: AuthPage
 * Pure Tailwind CSS implementation.
 * Responsive two-panel landing page with feature highlights & AuthCard.
 */
const AuthPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: '🔒', text: 'JWT-secured authentication' },
    { icon: '☁️', text: 'Profile photos stored on AWS S3' },
    { icon: '🍃', text: 'MongoDB Atlas cloud database' },
    { icon: '📸', text: 'Live camera photo capture' },
  ];

  return (
    <div className="min-h-screen bg-[#060b18] text-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">

      {/* Ambient Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Branding Panel */}
          <div className="hidden lg:flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30 shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent tracking-tight">
                  ProfileApp
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Your identity, your way</p>
              </div>
            </div>

            <div>
              <h1 className="text-4xl font-extrabold text-slate-100 leading-tight tracking-tight mb-3">
                Build your <br />
                <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  professional profile
                </span>
              </h1>
              <p className="text-base text-slate-400 leading-relaxed max-w-sm">
                Securely store and share your profile with AWS-powered infrastructure.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {features.map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm shrink-0">
                    {icon}
                  </div>
                  <span className="text-sm text-slate-300 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Auth Card Panel */}
          <div className="w-full flex flex-col gap-4">
            <AuthCard onAuthSuccess={() => navigate(ROUTES.PROFILE, { replace: true })} />
            <p className="text-center text-xs text-slate-500">
              By signing up you agree to our Terms of Service.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
