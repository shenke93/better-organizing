import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useInventory } from '../../context/InventoryContext';
import './LocationPicker.css';

export function LocationPicker({ 
  selectedPlaceId, 
  selectedStorageLocationId, 
  onChange,
  error 
}) {
  const { t } = useTranslation();
  const { places, storageLocations } = useInventory();

  // Filter storage locations for the selected place
  const filteredStorageLocations = storageLocations.filter(
    (sl) => sl.placeId === selectedPlaceId
  );

  const handlePlaceChange = (e) => {
    const placeId = e.target.value;
    // Reset storage location when place changes
    onChange?.({ placeId, storageLocationId: '' });
  };

  const handleStorageChange = (e) => {
    const storageLocationId = e.target.value;
    onChange?.({ placeId: selectedPlaceId, storageLocationId });
  };

  return (
    <div className="location-picker-container">
      <div className="grid-2">
        <div className="form-group">
          <label className="input-label" htmlFor="place-select">
            {t('item.place')} <span className="label-required">*</span>
          </label>
          <select
            id="place-select"
            className={`picker-select ${error && !selectedPlaceId ? 'picker-error' : ''}`}
            value={selectedPlaceId || ''}
            onChange={handlePlaceChange}
          >
            <option value="">{t('item.selectPlace')}</option>
            {places.map((place) => (
              <option key={place.id} value={place.id}>
                {place.icon} {place.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="input-label" htmlFor="storage-select">
            {t('item.storageLocation')} <span className="label-required">*</span>
          </label>
          <select
            id="storage-select"
            className={`picker-select ${error && !selectedStorageLocationId ? 'picker-error' : ''}`}
            value={selectedStorageLocationId || ''}
            onChange={handleStorageChange}
            disabled={!selectedPlaceId}
          >
            <option value="">
              {!selectedPlaceId 
                ? t('item.selectPlace') 
                : filteredStorageLocations.length === 0 
                  ? t('item.noStorageLocations') 
                  : t('item.selectStorage')
              }
            </option>
            {filteredStorageLocations.map((sl) => (
              <option key={sl.id} value={sl.id}>
                {sl.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {error && <span className="picker-error-text">{error}</span>}
    </div>
  );
}
