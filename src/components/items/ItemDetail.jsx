import { useTranslation } from 'react-i18next';
import { Calendar, Tag, MapPin, Clipboard, Package, Edit, Trash2 } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { CATEGORIES } from '../../utils/constants';
import { ExpiryBadge } from './ExpiryBadge';
import { formatDate } from '../../utils/expiry';
import { Button } from '../ui/Button';
import './ItemDetail.css';

export function ItemDetail({ item, onEdit, onDelete, onClose }) {
  const { t } = useTranslation();
  const { storageLocations, places } = useInventory();

  // Find category config
  const categoryConfig = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[3];

  // Resolve location info
  const storageLocation = storageLocations.find((sl) => sl.id === item.storageLocationId);
  const place = storageLocation ? places.find((p) => p.id === storageLocation.placeId) : null;

  return (
    <div className="item-detail-container">
      {/* Header section with Category Circle */}
      <div className="item-detail-header-card">
        <div 
          className="item-detail-category-circle"
          style={{ backgroundColor: `${categoryConfig.color}15`, color: categoryConfig.color }}
        >
          {categoryConfig.icon}
        </div>
        <div className="item-detail-summary">
          <h2 className="item-detail-name">{item.name}</h2>
          <div className="item-detail-badges">
            <span className="detail-cat-badge">
              {t(`category.${item.category}`)}
            </span>
            {item.subcategory && (
              <span className="detail-subcat-badge">{item.subcategory}</span>
            )}
            <ExpiryBadge expiryDate={item.expiryDate} size="md" />
          </div>
        </div>
      </div>

      {/* Details list */}
      <div className="item-detail-grid">
        {/* Quantity */}
        <div className="detail-row">
          <div className="detail-icon"><Package size={18} /></div>
          <div className="detail-info">
            <span className="detail-label">{t('item.quantity')}</span>
            <span className="detail-value highlight-text">
              {item.quantity} <span className="detail-unit">{item.unit || 'pcs'}</span>
            </span>
          </div>
        </div>

        {/* Location */}
        <div className="detail-row">
          <div className="detail-icon"><MapPin size={18} /></div>
          <div className="detail-info">
            <span className="detail-label">{t('item.location')}</span>
            <span className="detail-value">
              {place && storageLocation ? (
                `${place.icon} ${place.name} › ${storageLocation.name}`
              ) : (
                <span className="no-value">{t('item.selectPlace')}</span>
              )}
            </span>
          </div>
        </div>

        {/* Expiry Date */}
        {item.expiryDate && (
          <div className="detail-row">
            <div className="detail-icon"><Calendar size={18} /></div>
            <div className="detail-info">
              <span className="detail-label">{t('item.expiryDate')}</span>
              <span className="detail-value">{formatDate(item.expiryDate)}</span>
            </div>
          </div>
        )}

        {/* Purchase Date */}
        {item.purchaseDate && (
          <div className="detail-row">
            <div className="detail-icon"><Calendar size={18} /></div>
            <div className="detail-info">
              <span className="detail-label">{t('item.purchaseDate')}</span>
              <span className="detail-value">{formatDate(item.purchaseDate)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      {item.notes && (
        <div className="item-detail-section">
          <h4 className="section-title">
            <Clipboard size={14} />
            <span>{t('item.notes')}</span>
          </h4>
          <p className="detail-notes-text">{item.notes}</p>
        </div>
      )}

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div className="item-detail-section">
          <h4 className="section-title">
            <Tag size={14} />
            <span>{t('item.tags')}</span>
          </h4>
          <div className="detail-tags-list">
            {item.tags.map((tag) => (
              <span key={tag} className="detail-tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="item-detail-timestamps">
        <div>{t('common.loading') ? '' : ''}</div>
        <span>{t('inventory.sortBy')}: {formatDate(item.createdAt)}</span>
      </div>

      {/* Action Footer */}
      <div className="item-detail-actions">
        <Button 
          variant="danger" 
          icon={Trash2} 
          onClick={() => onDelete?.(item)}
        >
          {t('common.delete')}
        </Button>
        <div className="actions-right">
          <Button variant="secondary" onClick={onClose}>
            {t('common.close')}
          </Button>
          <Button 
            variant="primary" 
            icon={Edit} 
            onClick={() => onEdit?.(item)}
          >
            {t('common.edit')}
          </Button>
        </div>
      </div>
    </div>
  );
}
