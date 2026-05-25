import { useTranslation } from 'react-i18next';
import { Edit2, Trash2, Box } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import './StorageLocationCard.css';

export function StorageLocationCard({ storageLocation, onEdit, onDelete }) {
  const { t } = useTranslation();
  const { items } = useInventory();

  // Calculate items in this specific storage location
  const itemCount = items.filter((item) => item.storageLocationId === storageLocation.id).length;

  return (
    <div className="storage-location-card">
      <div className="storage-info">
        <div className="storage-icon-wrapper">
          <Box size={14} />
        </div>
        <div className="storage-text">
          <h4 className="storage-name">{storageLocation.name}</h4>
          {storageLocation.description && (
            <p className="storage-desc truncate">{storageLocation.description}</p>
          )}
        </div>
      </div>

      <div className="storage-meta">
        <span className="storage-item-count">
          {t('locations.itemCount', { count: itemCount })}
        </span>
        <div className="storage-actions">
          <button 
            className="storage-action-btn edit" 
            onClick={(e) => { e.stopPropagation(); onEdit?.(storageLocation); }}
            aria-label={t('locations.editStorage')}
          >
            <Edit2 size={11} />
          </button>
          <button 
            className="storage-action-btn delete" 
            onClick={(e) => { e.stopPropagation(); onDelete?.(storageLocation); }}
            aria-label={t('locations.deleteStorage')}
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
