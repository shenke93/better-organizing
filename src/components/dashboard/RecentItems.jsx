import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../utils/constants';
import { formatDate } from '../../utils/expiry';
import { useInventory } from '../../context/InventoryContext';
import './RecentItems.css';

export function RecentItems({ items, onViewAll, onViewItem }) {
  const { t } = useTranslation();
  const { storageLocations, places } = useInventory();

  // Sort by createdAt descending
  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="recent-items-container glass-card stagger-item">
      <div className="list-card-header">
        <h4 className="list-title">{t('dashboard.recentlyAdded')}</h4>
        {items.length > 5 && (
          <button className="view-all-btn" onClick={onViewAll}>
            <span>{t('dashboard.viewAll')}</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      <div className="list-body">
        {recentItems.length === 0 ? (
          <div className="list-empty-state">
            <Sparkles size={28} className="empty-sparkle-icon" />
            <span>{t('dashboard.noRecentItems')}</span>
          </div>
        ) : (
          <div className="recent-rows">
            {recentItems.map((item) => {
              const catConfig = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[3];
              
              // Resolve location info
              const storageLocation = storageLocations.find((sl) => sl.id === item.storageLocationId);
              const place = storageLocation ? places.find((p) => p.id === storageLocation.placeId) : null;

              return (
                <div 
                  key={item.id} 
                  className="recent-item-row"
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
                      <span className="row-item-subtext truncate">
                        {place && storageLocation 
                          ? `${place.icon} ${place.name} › ${storageLocation.name}`
                          : t('item.selectPlace')
                        }
                      </span>
                    </div>
                  </div>
                  <div className="row-right">
                    <span className="recent-added-date">
                      {formatDate(item.createdAt)}
                    </span>
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
