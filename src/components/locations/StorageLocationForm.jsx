import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useInventory } from '../../context/InventoryContext';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import './StorageLocationForm.css';

export function StorageLocationForm({ placeId, initialData, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const { places } = useInventory();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    placeId: placeId || '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        placeId: initialData.placeId || placeId || '',
      });
    } else if (placeId) {
      setFormData((prev) => ({ ...prev, placeId }));
    }
  }, [initialData, placeId]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('locations.storageName') + ' ' + t('item.required');
    }
    if (!formData.placeId) {
      newErrors.placeId = t('item.place') + ' ' + t('item.required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
    });
  };

  return (
    <form className="storage-location-form" onSubmit={handleSubmit}>
      {/* Place Select (only if not pre-specified or when editing) */}
      {!placeId && (
        <div className="form-group">
          <label className="input-label" htmlFor="sl-place-select">
            {t('item.place')} <span className="label-required">*</span>
          </label>
          <select
            id="sl-place-select"
            className={`picker-select ${errors.placeId ? 'picker-error' : ''}`}
            value={formData.placeId}
            onChange={(e) => handleChange('placeId', e.target.value)}
          >
            <option value="">{t('item.selectPlace')}</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.icon} {p.name}
              </option>
            ))}
          </select>
          {errors.placeId && <span className="picker-error-text">{errors.placeId}</span>}
        </div>
      )}

      {/* Name */}
      <div className="form-group">
        <label className="input-label" htmlFor="storage-name-input">
          {t('locations.storageName')} <span className="label-required">*</span>
        </label>
        <Input
          id="storage-name-input"
          placeholder={t('locations.storageNamePlaceholder')}
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          fullWidth
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="input-label" htmlFor="storage-desc-input">
          {t('locations.storageDescription')}
        </label>
        <Input
          id="storage-desc-input"
          placeholder={t('locations.storageDescriptionPlaceholder')}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          fullWidth
        />
      </div>

      <div className="form-footer">
        <Button variant="secondary" type="button" onClick={onCancel}>
          {t('locations.cancel')}
        </Button>
        <Button variant="primary" type="submit">
          {t('locations.save')}
        </Button>
      </div>
    </form>
  );
}
