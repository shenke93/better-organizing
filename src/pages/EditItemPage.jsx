import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Sparkles, ClipboardList, AlertCircle } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useToast } from '../components/ui/Toast';
import { ItemForm } from '../components/items/ItemForm';
import { QuickAddWizard } from '../components/items/QuickAddWizard';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';

export default function EditItemPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const { items, updateItem } = useInventory();

  // Mode Selection State: 'quick' | 'full'
  const [addMode, setAddMode] = useState(() => {
    return localStorage.getItem('homestorage-add-mode') || 'quick';
  });

  const handleModeChange = (mode) => {
    setAddMode(mode);
    localStorage.setItem('homestorage-add-mode', mode);
  };

  // Find item
  const item = items.find((i) => i.id === id);

  const handleSubmit = async (itemData) => {
    try {
      await updateItem(itemData);
      addToast(t('item.updateSuccess'), 'success');
      navigate('/inventory');
    } catch (err) {
      addToast(t('common.error'), 'error');
    }
  };

  const handleCancel = () => {
    navigate('/inventory');
  };

  if (!item) {
    return (
      <EmptyState
        icon={AlertCircle}
        title={t('common.error')}
        description={t('inventory.noResultsDescription')}
        action={
          <Button variant="secondary" onClick={() => navigate('/inventory')}>
            {t('common.back')}
          </Button>
        }
      />
    );
  }

  return (
    <div className="edit-item-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="page-title">{t('inventory.editItem')}</h1>
          <p className="page-subtitle">{item.name}</p>
        </div>

        {/* Form Mode Toggle Tabs */}
        <div className="form-mode-tabs glass-card" style={{ display: 'flex', padding: '4px', borderRadius: 'var(--radius-md)' }}>
          <button
            type="button"
            className={`mode-tab-btn ${addMode === 'quick' ? 'active' : ''}`}
            onClick={() => handleModeChange('quick')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: addMode === 'quick' ? 'var(--accent-primary)' : 'transparent',
              color: addMode === 'quick' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            <Sparkles size={14} />
            <span>{t('wizard.quickAdd')}</span>
          </button>
          <button
            type="button"
            className={`mode-tab-btn ${addMode === 'full' ? 'active' : ''}`}
            onClick={() => handleModeChange('full')}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: addMode === 'full' ? 'var(--accent-primary)' : 'transparent',
              color: addMode === 'full' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: 'var(--font-size-xs)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            <ClipboardList size={14} />
            <span>{t('wizard.fullForm')}</span>
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
        {addMode === 'quick' ? (
          <QuickAddWizard initialData={item} onSubmit={handleSubmit} onCancel={handleCancel} />
        ) : (
          <ItemForm initialData={item} onSubmit={handleSubmit} onCancel={handleCancel} />
        )}
      </div>
    </div>
  );
}
