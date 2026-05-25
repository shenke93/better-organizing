import './FilterChips.css';

export function FilterChips({ options, value, onChange, className = '' }) {
  return (
    <div className={`filter-chips ${className}`}>
      {options.map((option) => (
        <button
          key={option.value ?? 'all'}
          className={`filter-chip ${value === option.value ? 'filter-chip-active' : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.icon && <span className="filter-chip-icon">{option.icon}</span>}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  );
}
