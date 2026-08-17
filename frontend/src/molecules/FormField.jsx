import React from 'react';
import Input from '../atoms/Input';

/**
 * MOLECULE: FormField
 * Pure Tailwind CSS implementation.
 * Encapsulates label, required badge, Input atom, error indicator, and helper text.
 */
const FormField = ({
  id,
  label,
  error,
  required = false,
  helperText,
  className = '',
  ...inputProps
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
        >
          {label}
          {required && <span className="text-violet-400 ml-1">*</span>}
        </label>
      )}
      <Input id={id} {...inputProps} error={error} />
      {error ? (
        <p className="text-xs text-red-400 mt-2 flex items-center gap-1.5 font-medium" role="alert">
          <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] text-slate-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default FormField;
