import { useTranslation } from 'react-i18next';
import { Clock, ArrowRight } from 'lucide-react';
import { daysUntilExpiry } from '../../utils/expiry';
import { ExpiryBadge } from '../items/ExpiryBadge';
import { CATEGORIES } from '../../utils/constants';
import './ExpiringList.css';

export function ExpiringList({ items, onViewAll, onViewItem }) {
  const { t } = useTranslation();

  // Filter items that have expiry dates and are expired or expiring in <= 7 days
  const expiringItems = items
    .filter((item) => {
      if (!item.expiryDate) return false;
      const days = daysUntilExpiry(item.expiryDate);
      return days <= 7; // Expired (days < 0) or warning (0-7 days)
    })
    .sort((a, b) => {
      // Sort expired/closest to expiry first
      return new Date(a.expiryDate) - new Date(b.expiryDate);
    });

  // Limit to top 5
  const displayedItems = expiringItems.slice(0, 5);

  return (
    <div className="expiring-list-container glass-card stagger-item">
      <div className="list-card-header">
        <h4 className="list-title">{t('dashboard.expiringItems')}</h4>
        {expiringItems.length > 5 && (
          <button className="view-all-btn" onClick={onViewAll}>
            <span>{t('dashboard.viewAll')}</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      <div className="list-body">
        {expiringItems.length === 0 ? (
          <div className="list-empty-state">
            <Clock size={28} className="empty-clock-icon" />
            <span>{t('dashboard.noExpiringItems')}</span>
          </div>
        ) : (
          <div className="expiring-rows">
            {displayedItems.map((item) => {
              const catConfig = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[3];
              return (
                <div 
                  key={item.id} 
                  className="expiring-item-row"
                  onClick={() => onViewItem?.(item)}
                >
                  <div className="row-left">
                    <span 
                      className="row-cat-icon"
                      style={{ backgroundColor: `${catConfig.color}15`, color: catConfig.color }}
                    >
                      {catConfig.icon}
                    </span>
                    <div className="row-item-text">
                      <span className="row-item-name truncate">{item.name}</span>
                      <span className="row-item-qty">
                        {item.quantity} {item.unit || 'pcs'}
                      </span>
                    </div>
                  </div>
                  <div className="row-right">
                    <ExpiryBadge expiryDate={item.expiryDate} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
