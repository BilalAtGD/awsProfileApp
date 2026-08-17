import React from 'react';

/**
 * Gender Select Options
 */
export const GENDER_OPTIONS = [
  { value: '', label: 'Select gender' },
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other / Prefer not to say' },
];

/**
 * Profile Detail Cards Configuration Helper
 * Returns normalized card data for View Mode
 */
export const getDetailCardsConfig = (profile) => [
  {
    label: 'Full Name',
    value: profile?.name || '—',
    badge: profile?.name ? 'PRIMARY' : 'REQUIRED',
    badgeStyle: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    ),
  },
  {
    label: 'Email Address',
    value: profile?.email || '—',
    badge: 'VERIFIED',
    badgeStyle: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
  {
    label: 'Phone Number',
    value: profile?.phone || '—',
    badge: 'OPTIONAL',
    badgeStyle: 'bg-slate-800/60 text-slate-400 border-slate-700/50',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    ),
  },
  {
    label: 'Age',
    value: profile?.age ? `${profile.age} Years Old` : '—',
    badge: 'OPTIONAL',
    badgeStyle: 'bg-slate-800/60 text-slate-400 border-slate-700/50',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    ),
  },
];
