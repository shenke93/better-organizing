import { forwardRef } from 'react';
import './Input.css';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    type = 'text',
    fullWidth = true,
    className = '',
    ...props
  },
  ref
) {
  return (
    <div className={`input-wrapper ${fullWidth ? 'input-full' : ''} ${error ? 'input-error' : ''} ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {Icon && <Icon className="input-icon" size={18} />}
        {type === 'textarea' ? (
          <textarea
            ref={ref}
            className={`input-field input-textarea ${Icon ? 'has-icon' : ''}`}
            {...props}
          />
        ) : type === 'select' ? (
          <select
            ref={ref}
            className={`input-field input-select ${Icon ? 'has-icon' : ''}`}
            {...props}
          >
            {props.children}
          </select>
        ) : (
          <input
            ref={ref}
            type={type}
            className={`input-field ${Icon ? 'has-icon' : ''}`}
            {...props}
          />
        )}
      </div>
      {error && <span className="input-error-text">{error}</span>}
      {helperText && !error && <span className="input-helper">{helperText}</span>}
    </div>
  );
});
