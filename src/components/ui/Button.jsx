import { forwardRef } from 'react';
import './Button.css';

export const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
    size = 'md', // 'sm' | 'md' | 'lg'
    icon: Icon,
    iconPosition = 'left',
    fullWidth = false,
    loading = false,
    disabled = false,
    className = '',
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${loading ? 'btn-loading' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn-spinner" />}
      {Icon && iconPosition === 'left' && !loading && (
        <Icon className="btn-icon" size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />
      )}
      {children && <span className="btn-text">{children}</span>}
      {Icon && iconPosition === 'right' && !loading && (
        <Icon className="btn-icon" size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />
      )}
    </button>
  );
});
