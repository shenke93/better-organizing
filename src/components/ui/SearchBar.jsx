import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import './SearchBar.css';

export function SearchBar({ value, onChange, placeholder, className = '' }) {
  const [localValue, setLocalValue] = useState(value || '');
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(val);
    }, 300);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className={`search-bar ${className}`}>
      <Search className="search-bar-icon" size={18} />
      <input
        ref={inputRef}
        type="text"
        className="search-bar-input"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {localValue && (
        <button className="search-bar-clear" onClick={handleClear} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
