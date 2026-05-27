import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Check, Plus, Minus, Calendar, Clipboard, Tag } from 'lucide-react';
import { CATEGORIES, UNITS } from '../../utils/constants';
import { LocationPicker } from '../locations/LocationPicker';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useInventory } from '../../context/InventoryContext';
import './QuickAddWizard.css';

export function QuickAddWizard({ initialData, onSubmit, onCancel }) {
  const { t } = useTranslation();
  const { storageLocations, places } = useInventory();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    category: 'food',
    subcategory: '',
    quantity: 1,
    unit: 'pcs',
    placeId: '',
    storageLocationId: '',
    expiryDate: '',
    registrationDate: new Date().toISOString().split('T')[0],
    notes: '',
    tags: [],
  });

  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const nameInputRef = useRef(null);

  // Sync initialData if editing
  useEffect(() => {
    if (initialData) {
      const storageLoc = storageLocations.find((sl) => sl.id === initialData.storageLocationId);
      const placeId = storageLoc ? storageLoc.placeId : '';

      setFormData({
        ...initialData,
        placeId,
        storageLocationId: initialData.storageLocationId || '',
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
        registrationDate: initialData.registrationDate ? new Date(initialData.registrationDate).toISOString().split('T')[0] : '',
        notes: initialData.notes || '',
        tags: initialData.tags || [],
      });
    }
  }, [initialData, storageLocations]);

  // Focus name input on mount / step 1
  useEffect(() => {
    if (step === 1) {
      nameInputRef.current?.focus();
    }
  }, [step]);

  const handleChange = (key, value) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      
      // Reactive clothing default expiry logic (+5 years)
      if (key === 'category' && value === 'clothing') {
        const regDateStr = next.registrationDate || new Date().toISOString().split('T')[0];
        const regDate = new Date(regDateStr);
        if (!isNaN(regDate.getTime())) {
          const expDate = new Date(regDate.getFullYear() + 5, regDate.getMonth(), regDate.getDate());
          next.expiryDate = expDate.toISOString().split('T')[0];
          if (!next.registrationDate) {
            next.registrationDate = regDateStr;
          }
        }
      } else if (key === 'registrationDate' && next.category === 'clothing') {
        const regDate = new Date(value);
        if (value && !isNaN(regDate.getTime())) {
          const expDate = new Date(regDate.getFullYear() + 5, regDate.getMonth(), regDate.getDate());
          next.expiryDate = expDate.toISOString().split('T')[0];
        }
      }
      
      return next;
    });
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleLocationChange = ({ placeId, storageLocationId }) => {
    setFormData((prev) => ({ ...prev, placeId, storageLocationId }));
    setErrors((prev) => ({ ...prev, storageLocationId: null }));
  };

  const handleAddTag = () => {
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

  const applyQuickExpiry = (days) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    handleChange('expiryDate', targetDate.toISOString().split('T')[0]);
  };

  const validateStep = () => {
    const newErrors = {};
    if (step === 1 && !formData.name.trim()) {
      newErrors.name = t('item.required');
    }
    if (step === 4) {
      if (!formData.placeId) newErrors.storageLocationId = t('item.required');
      if (!formData.storageLocationId) newErrors.storageLocationId = t('item.required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = (e) => {
    e?.preventDefault();
    if (validateStep()) {
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!validateStep()) return;

    const submission = {
      name: formData.name.trim(),
      category: formData.category,
      subcategory: formData.subcategory.trim() || undefined,
      quantity: Number(formData.quantity),
      unit: formData.unit,
      storageLocationId: formData.storageLocationId,
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
      registrationDate: formData.registrationDate ? new Date(formData.registrationDate).toISOString() : undefined,
      notes: formData.notes.trim() || undefined,
      tags: formData.tags.length > 0 ? formData.tags : undefined,
    };

    if (initialData?.id) {
      submission.id = initialData.id;
      submission.createdAt = initialData.createdAt;
    }

    onSubmit(submission);
  };

  // Find selected place/shelf text
  const selectedPlace = places.find((p) => p.id === formData.placeId);
  const selectedShelf = storageLocations.find((sl) => sl.id === formData.storageLocationId);

  return (
    <div className="quick-add-wizard">
      {/* Wizard Progress Bar */}
      <div className="wizard-progress-bar">
        {[1, 2, 3, 4, 5].map((s) => (
          <div 
            key={s} 
            className={`progress-step-node ${step === s ? 'active' : step > s ? 'completed' : ''}`}
            onClick={() => s < step && setStep(s)}
          >
            <span className="node-number">{step > s ? <Check size={12} /> : s}</span>
          </div>
        ))}
        <div className="progress-fill-line" style={{ width: `${((step - 1) / 4) * 100}%` }} />
      </div>

      <div className="wizard-body animate-scale-in">
        {/* STEP 1: What is the item name? */}
        {step === 1 && (
          <div className="wizard-step-panel">
            <h2 className="wizard-step-question">{t('wizard.step1')}</h2>
            <div className="wizard-input-container">
              <input
                ref={nameInputRef}
                type="text"
                className={`wizard-large-input ${errors.name ? 'input-error-border' : ''}`}
                placeholder={t('item.namePlaceholder')}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext(e)}
              />
              {errors.name && <span className="wizard-error-text">{errors.name}</span>}
            </div>
            
            <div className="wizard-input-subgroup">
              <label className="wizard-sub-label">{t('item.subcategory')}</label>
              <Input
                placeholder={t('item.subcategoryPlaceholder')}
                value={formData.subcategory}
                onChange={(e) => handleChange('subcategory', e.target.value)}
                className="wizard-subcat-input"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Category */}
        {step === 2 && (
          <div className="wizard-step-panel">
            <h2 className="wizard-step-question">{t('wizard.step2')}</h2>
            <div className="wizard-category-choices">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`wizard-category-card ${formData.category === cat.id ? 'active' : ''}`}
                  style={{ '--cat-color': cat.color }}
                  onClick={() => {
                    handleChange('category', cat.id);
                    setTimeout(() => handleNext(), 150); // micro-delay for active selection feel
                  }}
                >
                  <span className="wizard-cat-emoji">{cat.icon}</span>
                  <span className="wizard-cat-label">{t(`category.${cat.id}`)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Quantity */}
        {step === 3 && (
          <div className="wizard-step-panel">
            <h2 className="wizard-step-question">{t('wizard.step3')}</h2>
            
            <div className="wizard-qty-panel">
              <div className="wizard-qty-control-row">
                <button 
                  type="button"
                  className="qty-adjust-circle"
                  onClick={() => handleChange('quantity', Math.max(0, Number(formData.quantity) - 1))}
                  disabled={formData.quantity <= 0}
                >
                  <Minus size={22} />
                </button>
                
                <input
                  type="number"
                  min="0"
                  step="any"
                  className="qty-huge-display"
                  value={formData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                />
                
                <button 
                  type="button"
                  className="qty-adjust-circle"
                  onClick={() => handleChange('quantity', Number(formData.quantity) + 1)}
                >
                  <Plus size={22} />
                </button>
              </div>

              <div className="wizard-unit-selector">
                <label className="wizard-sub-label">{t('item.unit')}</label>
                <select
                  className="picker-select wizard-unit-dropdown"
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
            </div>
          </div>
        )}

        {/* STEP 4: Location cascading picker */}
        {step === 4 && (
          <div className="wizard-step-panel">
            <h2 className="wizard-step-question">{t('wizard.step4')}</h2>
            <div className="wizard-location-wrapper">
              <LocationPicker
                selectedPlaceId={formData.placeId}
                selectedStorageLocationId={formData.storageLocationId}
                onChange={handleLocationChange}
                error={errors.storageLocationId}
              />
            </div>
          </div>
        )}

        {/* STEP 5: Dates, Notes, and Summary */}
        {step === 5 && (
          <div className="wizard-step-panel scrollable-panel">
            <h2 className="wizard-step-question">{t('wizard.step5')}</h2>

            {/* Quick Expiry Section (For Food items) */}
            {formData.category === 'food' && (
              <div className="wizard-quick-expiry-section">
                <span className="wizard-sub-label">{t('wizard.quickExpiry')}</span>
                <div className="expiry-presets-row">
                  <button type="button" className="preset-btn" onClick={() => applyQuickExpiry(3)}>{t('wizard.preset3Days')}</button>
                  <button type="button" className="preset-btn" onClick={() => applyQuickExpiry(7)}>{t('wizard.preset1Week')}</button>
                  <button type="button" className="preset-btn" onClick={() => applyQuickExpiry(30)}>{t('wizard.preset1Month')}</button>
                  <button 
                    type="button" 
                    className="preset-btn clear"
                    onClick={() => handleChange('expiryDate', '')}
                  >
                    {t('wizard.clearExpiry')}
                  </button>
                </div>
              </div>
            )}

            <div className="review-grid">
              {/* Expiry / Purchase Dates inputs */}
              <div className="review-dates-col">
                <div className="form-group">
                  <label className="input-label"><Calendar size={12} /> {t('item.expiryDate')}</label>
                  <Input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => handleChange('expiryDate', e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ marginTop: 'var(--space-2)' }}>
                  <label className="input-label"><Calendar size={12} /> {t('item.registrationDate')}</label>
                  <Input
                    type="date"
                    value={formData.registrationDate}
                    onChange={(e) => handleChange('registrationDate', e.target.value)}
                  />
                </div>
              </div>

              {/* Notes and Tags */}
              <div className="review-notes-col">
                <div className="form-group">
                  <label className="input-label"><Clipboard size={12} /> {t('item.notes')}</label>
                  <textarea
                    rows="2"
                    className="form-textarea"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder={t('item.notesPlaceholder')}
                  />
                </div>
                <div className="form-group" style={{ marginTop: 'var(--space-2)' }}>
                  <label className="input-label"><Tag size={12} /> {t('item.tags')}</label>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder={t('item.tagsPlaceholder')}
                    />
                    <button type="button" className="tag-add-btn" onClick={handleAddTag}>+</button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="form-tags-list" style={{ marginTop: '4px' }}>
                      {formData.tags.map((tag) => (
                        <span key={tag} className="form-tag-pill">
                          {tag}
                          <button type="button" className="tag-remove-btn" onClick={() => handleRemoveTag(tag)}>x</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Overall Summary Card */}
            <div className="wizard-summary-card glass-card">
              <span className="summary-card-header">{t('wizard.summary')}</span>
              <div className="summary-fields-row">
                <div className="summary-field">
                  <span className="summary-label">{t('wizard.item')}</span>
                  <span className="summary-value truncate">{formData.name}</span>
                </div>
                <div className="summary-field">
                  <span className="summary-label">{t('wizard.quantity')}</span>
                  <span className="summary-value">{formData.quantity} {formData.unit}</span>
                </div>
                <div className="summary-field">
                  <span className="summary-label">{t('wizard.location')}</span>
                  <span className="summary-value truncate">
                    {selectedPlace ? `${selectedPlace.icon} ${selectedPlace.name}` : ''}
                    {selectedShelf ? ` › ${selectedShelf.name}` : t('wizard.notSet')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="wizard-footer">
        {step > 1 ? (
          <Button variant="secondary" type="button" onClick={handleBack} icon={ArrowLeft}>
            {t('common.back')}
          </Button>
        ) : (
          <Button variant="secondary" type="button" onClick={onCancel}>
            {t('item.cancel')}
          </Button>
        )}

        {step < 5 ? (
          <Button variant="primary" type="button" onClick={handleNext} icon={ArrowRight} iconPosition="right">
            {t('common.next')}
          </Button>
        ) : (
          <Button variant="primary" type="button" onClick={handleSubmit} icon={Check}>
            {t('item.save')}
          </Button>
        )}
      </div>
    </div>
  );
}
