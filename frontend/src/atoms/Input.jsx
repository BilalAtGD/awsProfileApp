import React, { forwardRef } from 'react';

/**
 * ATOM: Input
 * Pure Tailwind CSS implementation.
 * Styled with clear padding, placeholder dimming, focus rings, and icon slots.
 */
const Input = forwardRef(
  (
    {
      id,
      name,
      type = 'text',
      placeholder,
      value,
      onChange,
      onBlur,
      disabled = false,
      error,
      leftIcon,
      rightIcon,
      className = '',
      autoComplete,
      min,
      max,
    },
    ref
  ) => {
    const baseInput =
      'w-full bg-white/[0.04] border text-slate-100 placeholder:text-slate-500 placeholder:font-normal text-sm rounded-xl py-3 outline-none transition-all duration-200 font-sans';

    const borderStyle = error
      ? 'border-red-500/70 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
      : 'border-white/10 focus:border-violet-500/80 focus:ring-2 focus:ring-violet-500/20 focus:bg-white/[0.06]';

    const paddingStyle = [
      leftIcon ? 'pl-11' : 'pl-4',
      rightIcon ? 'pr-11' : 'pr-4',
    ].join(' ');

    const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';

    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={autoComplete}
          min={min}
          max={max}
          className={`${baseInput} ${borderStyle} ${paddingStyle} ${disabledStyle} ${className}`}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
