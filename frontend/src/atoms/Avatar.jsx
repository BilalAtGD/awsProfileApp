import React, { useState, useEffect } from 'react';

/**
 * ATOM: Avatar
 * Pure Tailwind CSS implementation.
 * Profile picture with gradient ring and fallback initials.
 */
const Avatar = ({ src, name = '', size = 'md', onClick }) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state whenever src changes so new images render immediately
  useEffect(() => {
    setHasError(false);
  }, [src]);

  const sizeClasses = {
    sm: 'w-9 h-9 text-xs',
    md: 'w-14 h-14 text-base',
    lg: 'w-22 h-22 text-2xl',
    xl: 'w-28 h-28 text-3xl',
  };

  const ringPadding = {
    sm: 'p-0.5',
    md: 'p-0.5',
    lg: 'p-1',
    xl: 'p-1',
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      onClick={onClick}
      className={`inline-flex shrink-0 rounded-full bg-gradient-to-tr from-violet-600 via-indigo-500 to-purple-500 shadow-md ${ringPadding[size] || 'p-0.5'} ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
    >
      <div className={`rounded-full overflow-hidden relative flex items-center justify-center bg-slate-900 ${sizeClasses[size] || sizeClasses.md}`}>
        {src && !hasError ? (
          <img
            key={src}
            src={src}
            alt={name || 'Profile picture'}
            className="w-full h-full object-cover block"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center font-bold text-white tracking-wider">
            {initials || '?'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Avatar;
