import React, { useEffect } from 'react';

/**
 * MOLECULE: AlertMessage
 * Styled toast/banner — uses inline styles so it always looks correct.
 * Types: 'success' | 'error' | 'info'
 */
const AlertMessage = ({
  type = 'info',
  message,
  onClose,
  autoClose = true,
  duration = 5000,
}) => {
  useEffect(() => {
    if (autoClose && message && onClose) {
      const t = setTimeout(onClose, duration);
      return () => clearTimeout(t);
    }
  }, [message, autoClose, duration, onClose]);

  if (!message) return null;

  const cfg = {
    success: {
      bg:     'rgba(16,185,129,0.12)',
      border: 'rgba(16,185,129,0.35)',
      color:  '#34d399',
      iconBg: 'rgba(16,185,129,0.18)',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg:     'rgba(239,68,68,0.1)',
      border: 'rgba(239,68,68,0.35)',
      color:  '#f87171',
      iconBg: 'rgba(239,68,68,0.16)',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      bg:     'rgba(99,102,241,0.10)',
      border: 'rgba(99,102,241,0.35)',
      color:  '#818cf8',
      iconBg: 'rgba(99,102,241,0.16)',
      icon: (
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const { bg, border, color, iconBg, icon } = cfg[type] || cfg.info;

  return (
    <div
      role="alert"
      className="anim-slide-down"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        padding: '14px 16px',
        borderRadius: '12px',
        border: `1px solid ${border}`,
        background: bg,
        animation: 'slideDown 0.25s ease',
      }}
    >
      {/* Icon circle */}
      <div style={{
        width: '32px', height: '32px', borderRadius: '8px',
        background: iconBg, color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>

      {/* Message */}
      <p style={{
        flex: 1,
        fontSize: '0.875rem',
        fontWeight: 500,
        color,
        lineHeight: 1.5,
        marginTop: '6px',
      }}>
        {message}
      </p>

      {/* Close button */}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: color,
            opacity: 0.6,
            padding: '2px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            transition: 'opacity 0.15s',
            flexShrink: 0,
            marginTop: '5px',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '1'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.6'}
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AlertMessage;
