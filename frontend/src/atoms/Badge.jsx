import React from 'react';

/**
 * ATOM: Badge
 * Colored chip for displaying categorical data (gender, status)
 */
const Badge = ({ label, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-slate-800/60 text-slate-300 border-slate-700/50',
    indigo:  'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    purple:  'bg-purple-500/15 text-purple-300 border-purple-500/30',
    pink:    'bg-pink-500/15 text-pink-300 border-pink-500/30',
    green:   'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    male:    'bg-blue-500/15 text-blue-300 border-blue-500/30',
    female:  'bg-pink-500/15 text-pink-300 border-pink-500/30',
    other:   'bg-purple-500/15 text-purple-300 border-purple-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variants[variant] || variants.default} ${className}`}
    >
      {label}
    </span>
  );
};

export default Badge;
