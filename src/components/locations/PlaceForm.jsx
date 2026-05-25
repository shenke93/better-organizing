import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PLACE_ICONS } from '../../utils/constants';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import './PlaceForm.css';

export function PlaceForm({ initialData, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: PLACE_ICONS[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        icon: initialData.icon || PLACE_ICONS[0],
      });
    }
  }, [initialData]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('locations.placeName') + ' ' + t('item.required');
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
    <form className="place-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="input-label" htmlFor="place-name-input">
          {t('locations.placeName')} <span className="label-required">*</span>
        </label>
        <Input
          id="place-name-input"
          placeholder={t('locations.placeNamePlaceholder')}
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          fullWidth
        />
      </div>

      <div className="form-group">
        <label className="input-label" htmlFor="place-desc-input">
          {t('locations.placeDescription')}
        </label>
        <Input
          id="place-desc-input"
          placeholder={t('locations.placeDescriptionPlaceholder')}
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          fullWidth
        />
      </div>

      <div className="form-group">
        <label className="input-label">{t('locations.placeIcon')}</label>
        <div className="emoji-picker-grid">
          {PLACE_ICONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className={`emoji-option-btn ${formData.icon === emoji ? 'active' : ''}`}
              onClick={() => handleChange('icon', emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
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
