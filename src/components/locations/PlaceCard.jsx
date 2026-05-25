import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit2, Trash2, Plus, ChevronDown, ChevronUp, Folder } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { StorageLocationCard } from './StorageLocationCard';
import './PlaceCard.css';

export function PlaceCard({ 
  place, 
  onEditPlace, 
  onDeletePlace, 
  onAddStorage, 
  onEditStorage, 
  onDeleteStorage 
}) {
  const { t } = useTranslation();
  const { storageLocations, items } = useInventory();
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter storage locations in this place
  const nestedStorages = storageLocations.filter((sl) => sl.placeId === place.id);

  // Calculate items in this place
  const storageIds = nestedStorages.map((sl) => sl.id);
  const itemsInPlaceCount = items.filter((item) => storageIds.includes(item.storageLocationId)).length;

  // Robust mapping for historical string place.icon identifiers to clean emojis
  const getPlaceIcon = (icon) => {
    if (!icon) return '🏠';
    const mapping = {
      kitchen: '🍳',
      bedroom: '🛏️',
      livingroom: '🛋️',
      bathroom: '🚿',
      garage: '🚗'
    };
    return mapping[icon.toLowerCase()] || icon;
  };

  return (
    <div className="place-card glass-card stagger-item">
      <div className="place-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="place-info-block">
          <div className="place-icon-badge">{getPlaceIcon(place.icon)}</div>
          <div className="place-text-details">
            <h3 className="place-title">{place.name}</h3>
            {place.description && (
              <p className="place-description truncate">{place.description}</p>
            )}
          </div>
        </div>

        <div className="place-meta-actions" onClick={(e) => e.stopPropagation()}>
          <div className="place-counts">
            <span className="place-count-badge">
              {t('locations.storageCount', { count: nestedStorages.length })}
            </span>
            <span className="place-count-badge accent">
              {t('locations.itemCount', { count: itemsInPlaceCount })}
            </span>
          </div>

          <div className="place-action-buttons">
            <button 
              className="place-btn edit" 
              onClick={() => onEditPlace?.(place)}
              aria-label={t('locations.editPlace')}
            >
              <Edit2 size={13} />
            </button>
            <button 
              className="place-btn delete" 
              onClick={() => onDeletePlace?.(place)}
              aria-label={t('locations.deletePlace')}
            >
              <Trash2 size={13} />
            </button>
            <button 
              className="place-btn add-sub" 
              onClick={() => onAddStorage?.(place.id)}
              title={t('locations.addStorage')}
              aria-label={t('locations.addStorage')}
            >
              <Plus size={13} />
            </button>
            <button 
              className="place-btn toggle-collapse"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-label={isExpanded ? t('nav.collapse') : t('nav.expand')}
            >
              {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="place-card-body">
          {nestedStorages.length === 0 ? (
            <div className="nested-empty-state">
              <Folder size={20} className="nested-empty-icon" />
              <span>{t('locations.noStorageLocationsDescription')}</span>
            </div>
          ) : (
            <div className="storage-locations-grid">
              {nestedStorages.map((sl) => (
                <StorageLocationCard
                  key={sl.id}
                  storageLocation={sl}
                  onEdit={onEditStorage}
                  onDelete={onDeleteStorage}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
