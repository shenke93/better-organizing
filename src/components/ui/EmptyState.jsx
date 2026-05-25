import { Package } from 'lucide-react';
import './EmptyState.css';

export function EmptyState({ icon: Icon = Package, title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon-wrapper">
        <Icon className="empty-state-icon" size={48} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
}
