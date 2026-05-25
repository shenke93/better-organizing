import { useTranslation } from 'react-i18next';
import { Edit2, Trash2, Minus, Plus } from 'lucide-react';
import { ExpiryBadge } from './ExpiryBadge';
import { CATEGORIES } from '../../utils/constants';
import { useInventory } from '../../context/InventoryContext';
import { useToast } from '../ui/Toast';
import './ItemCard.css';

export function ItemCard({ item, onEdit, onDelete, onView }) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { storageLocations, places, updateItem } = useInventory();

  // Find category config
  const categoryConfig = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[3];

  // Resolve location info
  const storageLocation = storageLocations.find((sl) => sl.id === item.storageLocationId);
  const place = storageLocation ? places.find((p) => p.id === storageLocation.placeId) : null;

  const handleIncrement = async (e) => {
    e.stopPropagation();
    try {
      const updated = { ...item, quantity: item.quantity + 1 };
      await updateItem(updated);
      addToast(t('item.updateSuccess'), 'success');
    } catch (err) {
      addToast(t('common.error'), 'error');
    }
  };

  const handleDecrement = async (e) => {
    e.stopPropagation();
    if (item.quantity <= 0) return;
    try {
      const updated = { ...item, quantity: Math.max(0, item.quantity - 1) };
      await updateItem(updated);
      addToast(t('item.updateSuccess'), 'success');
    } catch (err) {
      addToast(t('common.error'), 'error');
    }
  };

  return (
    <div className="item-card glass-card stagger-item" onClick={() => onView?.(item)}>
      <div className="item-card-header">
        <div 
          className="item-category-icon" 
          style={{ backgroundColor: `${categoryConfig.color}15`, color: categoryConfig.color }}
        >
          {categoryConfig.icon}
        </div>
        <div className="item-badge-group">
          {item.subcategory && (
            <span className="item-subcategory-badge">{item.subcategory}</span>
          )}
          <ExpiryBadge expiryDate={item.expiryDate} />
        </div>
      </div>

      <div className="item-card-content">
        <h3 className="item-name truncate">{item.name}</h3>
        
        <div className="item-location">
          {place && storageLocation ? (
            <span className="item-location-text truncate">
              {place.icon} {place.name} › {storageLocation.name}
            </span>
          ) : (
            <span className="item-location-none truncate">{t('item.selectPlace')}</span>
          )}
        </div>

        {item.notes && <p className="item-card-notes truncate">{item.notes}</p>}
      </div>

      <div className="item-card-footer">
        <div className="item-quantity-control">
          <button 
            className="quantity-btn" 
            onClick={handleDecrement}
            disabled={item.quantity <= 0}
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="quantity-value">
            {item.quantity} <span className="quantity-unit">{item.unit || 'pcs'}</span>
          </span>
          <button 
            className="quantity-btn" 
            onClick={handleIncrement}
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        <div className="item-actions">
          <button 
            className="item-action-btn edit-btn" 
            onClick={(e) => { e.stopPropagation(); onEdit?.(item); }}
            aria-label={t('common.edit')}
          >
            <Edit2 size={14} />
          </button>
          <button 
            className="item-action-btn delete-btn" 
            onClick={(e) => { e.stopPropagation(); onDelete?.(item); }}
            aria-label={t('common.delete')}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
