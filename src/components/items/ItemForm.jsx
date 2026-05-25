import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus } from 'lucide-react';
import { CATEGORIES, UNITS } from '../../utils/constants';
import { LocationPicker } from '../locations/LocationPicker';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useInventory } from '../../context/InventoryContext';
import './ItemForm.css';

export function ItemForm({ initialData, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const { storageLocations } = useInventory();

  const [formData, setFormData] = useState({
    name: '',
    category: 'food',
    subcategory: '',
    quantity: 1,
    unit: 'pcs',
    placeId: '',
    storageLocationId: '',
    expiryDate: '',
    purchaseDate: '',
    notes: '',
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  // Sync initialData if editing
  useEffect(() => {
    if (initialData) {
      // Find placeId from storageLocationId
      const storageLoc = storageLocations.find((sl) => sl.id === initialData.storageLocationId);
      const placeId = storageLoc ? storageLoc.placeId : '';

      setFormData({
        ...initialData,
        placeId,
        storageLocationId: initialData.storageLocationId || '',
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
        purchaseDate: initialData.purchaseDate ? new Date(initialData.purchaseDate).toISOString().split('T')[0] : '',
        notes: initialData.notes || '',
        tags: initialData.tags || [],
      });
    }
  }, [initialData, storageLocations]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const handleLocationChange = ({ placeId, storageLocationId }) => {
    setFormData((prev) => ({ ...prev, placeId, storageLocationId }));
    if (errors.storageLocationId) {
      setErrors((prev) => ({ ...prev, storageLocationId: null }));
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = t('item.required');
    if (!formData.placeId) newErrors.storageLocationId = t('item.required');
    if (!formData.storageLocationId) newErrors.storageLocationId = t('item.required');
    if (formData.quantity === undefined || formData.quantity === null || formData.quantity < 0) {
      newErrors.quantity = t('item.required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Build item submission payload
    const submission = {
      name: formData.name.trim(),
      category: formData.category,
      subcategory: formData.subcategory.trim() || undefined,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      storageLocationId: formData.storageLocationId,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
      purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate).toISOString() : undefined,
      notes: formData.notes.trim() || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
    };

    if (initialData?.id) {
      submission.id = initialData.id;
      submission.createdAt = initialData.createdAt;
    }

    onSubmit(submission);
  };

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {/* Name */}
        <div className="form-group span-2">
          <label className="input-label" htmlFor="item-name">
            {t('item.name')} <span className="label-required">*</span>
          </label>
          <Input
            id="item-name"
            placeholder={t('item.namePlaceholder')}
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            error={errors.name}
            fullWidth
          />
        </div>

        {/* Category */}
        <div className="form-group span-2">
          <label className="input-label">{t('item.category')}</label>
          <div className="category-select-grid">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-btn-option ${formData.category === cat.id ? 'active' : ''}`}
                style={{ 
                  '--cat-color': cat.color,
                  '--cat-glow': `${cat.color}15`
                }}
                onClick={() => handleChange('category', cat.id)}
              >
                <span className="cat-icon">{cat.icon}</span>
                <span className="cat-label">{t(`category.${cat.id}`)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory */}
        <div className="form-group span-2">
          <label className="input-label" htmlFor="item-subcat">
            {t('item.subcategory')}
          </label>
          <Input
            id="item-subcat"
            placeholder={t('item.subcategoryPlaceholder')}
            value={formData.subcategory}
            onChange={(e) => handleChange('subcategory', e.target.value)}
            fullWidth
          />
        </div>

        {/* Quantity and Unit */}
        <div className="form-group">
          <label className="input-label" htmlFor="item-qty">
            {t('item.quantity')} <span className="label-required">*</span>
          </label>
          <Input
            id="item-qty"
            type="number"
            min="0"
            step="any"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', e.target.value)}
            error={errors.quantity}
            fullWidth
          />
        </div>

        <div className="form-group">
          <label className="input-label" htmlFor="item-unit">
            {t('item.unit')}
          </label>
          <select
            id="item-unit"
            className="picker-select"
            value={formData.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
          >
            {UNITS.map((unit) => (
              <option key={unit} value={unit}>
                {t(`unit.${unit}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Location Selector (Place & Storage cascading picker) */}
        <div className="span-2">
          <LocationPicker
            selectedPlaceId={formData.placeId}
            selectedStorageLocationId={formData.storageLocationId}
            onChange={handleLocationChange}
            error={errors.storageLocationId}
          />
        </div>

        {/* Expiry Date */}
        <div className="form-group">
          <label className="input-label" htmlFor="item-expiry">
            {t('item.expiryDate')}
          </label>
          <Input
            id="item-expiry"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => handleChange('expiryDate', e.target.value)}
            fullWidth
          />
        </div>

        {/* Purchase Date */}
        <div className="form-group">
          <label className="input-label" htmlFor="item-purchase">
            {t('item.purchaseDate')}
          </label>
          <Input
            id="item-purchase"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => handleChange('purchaseDate', e.target.value)}
            fullWidth
          />
        </div>

        {/* Notes */}
        <div className="form-group span-2">
          <label className="input-label" htmlFor="item-notes">
            {t('item.notes')}
          </label>
          <textarea
            id="item-notes"
            className="form-textarea"
            rows="3"
            placeholder={t('item.notesPlaceholder')}
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </div>

        {/* Tags */}
        <div className="form-group span-2">
          <label className="input-label" htmlFor="item-tags">
            {t('item.tags')}
          </label>
          <div className="tags-input-wrapper">
            <Input
              id="item-tags"
              placeholder={t('item.tagsPlaceholder')}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              fullWidth
            />
            <button
              type="button"
              className="tag-add-btn"
              onClick={handleAddTag}
              aria-label="Add tag"
            >
              <Plus size={16} />
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="form-tags-list">
              {formData.tags.map((tag) => (
                <span key={tag} className="form-tag-pill">
                  {tag}
                  <button
                    type="button"
                    className="tag-remove-btn"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="form-footer">
        <Button variant="secondary" type="button" onClick={onCancel}>
          {t('item.cancel')}
        </Button>
        <Button variant="primary" type="submit">
          {t('item.save')}
        </Button>
      </div>
    </form>
  );
}
