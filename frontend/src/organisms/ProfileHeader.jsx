import React from 'react';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import { useAuthStore } from '../store/authStore';

/**
 * ORGANISM: ProfileHeader
 * Pure Tailwind CSS Sidebar Panel showing user avatar, email badge, phone/member metadata, and primary action controls.
 */
const ProfileHeader = ({ profile, avatarUrl, isEditing, onToggleEdit, onLogout }) => {
  const { user } = useAuthStore();

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  const displayName  = profile?.name  || user?.name  || 'User';
  const displayEmail = profile?.email || user?.email  || '';

  return (
    <div className="w-full bg-[#0d1428]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-6 shadow-2xl">

      {/* ── Avatar Section ── */}
      <div className="relative flex flex-col items-center">
        <Avatar src={avatarUrl || profile?.picture} name={displayName} size="lg" />
        <span className="absolute bottom-0 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0d1428] rounded-full shadow-sm" title="Online" />
      </div>

      {/* ── Name & Email Block ── */}
      <div className="text-center w-full px-1">
        <h2 className="text-lg font-bold text-slate-100 leading-tight tracking-tight">{displayName}</h2>
        <p className="text-xs text-slate-300 mt-2 break-all font-mono bg-white/5 border border-white/10 py-1.5 px-3 rounded-lg inline-block max-w-full truncate">
          {displayEmail}
        </p>
      </div>

      {/* ── Badges Summary ── */}
      {(profile?.gender || profile?.age) && (
        <div className="flex flex-wrap justify-center gap-2 w-full">
          {profile.gender && (
            <Badge
              label={profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1)}
              variant={profile.gender}
            />
          )}
          {profile.age && <Badge label={`${profile.age} Years`} variant="indigo" />}
        </div>
      )}

      {/* ── Info Rows (Phone & Member Since) ── */}
      <div className="w-full space-y-3 pt-5 border-t border-white/10">

        {/* Phone Row */}
        <div className="flex items-center gap-4 p-3.5 bg-white/[0.03] border border-white/8 rounded-xl hover:bg-white/[0.06] hover:border-violet-500/30 transition-all">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-0.5">Phone Number</p>
            <p className="text-sm font-medium text-slate-100 truncate">
              {profile?.phone || <span className="text-slate-500 font-normal">—</span>}
            </p>
          </div>
        </div>

        {/* Member Since Row */}
        {memberSince && (
          <div className="flex items-center gap-4 p-3.5 bg-white/[0.03] border border-white/8 rounded-xl hover:bg-white/[0.06] hover:border-violet-500/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase mb-0.5">Member Since</p>
              <p className="text-sm font-medium text-slate-100">{memberSince}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Action Controls (Separated by 20px top gap + border line) ── */}
      <div className="w-full space-y-3 pt-5 border-t border-white/10">
        <Button
          id="toggle-edit-btn"
          variant={isEditing ? 'secondary' : 'primary'}
          fullWidth
          onClick={onToggleEdit}
        >
          {isEditing ? (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel Editing
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </>
          )}
        </Button>

        <Button id="logout-btn" variant="danger" fullWidth onClick={onLogout}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
