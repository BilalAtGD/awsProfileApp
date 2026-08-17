import React from 'react';
import Spinner from './Spinner';

/**
 * ATOM: Button
 * Pure Tailwind CSS implementation.
 * Variants: primary, secondary, ghost, danger
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  className = '',
  id,
}) => {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl cursor-pointer transition-all duration-200 select-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none shrink-0';

  const sizes = {
    sm: 'px-3.5 py-2 text-xs gap-1.5 min-h-[36px]',
    md: 'px-5 py-2.5 text-sm gap-2 min-h-[42px]',
    lg: 'px-6 py-3 text-base gap-2.5 min-h-[48px]',
  };

  const variants = {
    primary:
      'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-violet-600/25 hover:from-violet-500 hover:to-purple-500 hover:shadow-violet-600/40 active:scale-[0.98]',
    secondary:
      'bg-white/5 border border-white/15 text-slate-200 hover:bg-white/10 hover:border-white/25 active:scale-[0.98]',
    ghost:
      'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5 active:scale-[0.98]',
    danger:
      'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 active:scale-[0.98]',
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {loading ? (
        <>
          <Spinner size="sm" />
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
