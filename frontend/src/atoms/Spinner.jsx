import React from 'react';
import Spinner from './Spinner';

/**
 * ATOM: Spinner — uses the new anim-spin class
 */
const SpinnerFixed = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-8 h-8 border-[3px]',
    xl: 'w-14 h-14 border-4',
  };

  return (
    <div
      className={`${sizes[size]} border-violet-500/25 border-t-violet-500 rounded-full anim-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default SpinnerFixed;
