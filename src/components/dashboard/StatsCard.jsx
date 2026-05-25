import './StatsCard.css';

export function StatsCard({ title, value, icon: Icon, description, status = 'info' }) {
  return (
    <div className={`stats-card glass-card stats-card-${status} stagger-item`}>
      <div className="stats-card-body">
        <div className="stats-info-side">
          <span className="stats-card-title">{title}</span>
          <h3 className="stats-card-value">{value}</h3>
          {description && <span className="stats-card-desc">{description}</span>}
        </div>
        <div className="stats-icon-side">
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
