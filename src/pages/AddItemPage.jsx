import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ClipboardList, MapPin, ArrowRight } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';
import { useToast } from '../components/ui/Toast';
import { ItemForm } from '../components/items/ItemForm';
import { QuickAddWizard } from '../components/items/QuickAddWizard';
import { GuidingBoard } from '../components/ui/GuidingBoard';
import { Button } from '../components/ui/Button';

export default function AddItemPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { addItem, places, addPlace, addStorageLocation, reloadData } = useInventory();
  const [isInitializing, setIsInitializing] = useState(false);

  // Mode Selection State: 'quick' | 'full'
  const [addMode, setAddMode] = useState(() => {
    return localStorage.getItem('homestorage-add-mode') || 'quick';
  });

  const handleModeChange = (mode) => {
    setAddMode(mode);
    localStorage.setItem('homestorage-add-mode', mode);
  };

  const handleAutoInit = async () => {
    setIsInitializing(true);
    try {
      const kitchen = await addPlace({ 
        name: t('locations.kitchenName'), 
        description: '🍳 ' + (t('category.food') || ''), 
        icon: '🍳' 
      });
      await addStorageLocation({ 
        placeId: kitchen.id, 
        name: t('locations.fridgeName'), 
        description: '❄️' 
      });
      await addStorageLocation({ 
        placeId: kitchen.id, 
        name: t('locations.pantryName'), 
        description: '🥫' 
      });

      const bedroom = await addPlace({ 
        name: t('locations.bedroomName'), 
        description: '🛏️', 
        icon: '🛏️' 
      });
      await addStorageLocation({ 
        placeId: bedroom.id, 
        name: t('locations.wardrobeName'), 
        description: '👗' 
      });

      const livingRoom = await addPlace({ 
        name: t('locations.livingRoomName'), 
        description: '🛋️', 
        icon: '🛋️' 
      });
      await addStorageLocation({ 
        placeId: livingRoom.id, 
        name: t('locations.bookshelfName'), 
        description: '📚' 
      });

      const bathroom = await addPlace({ 
        name: t('locations.bathroomName'), 
        description: '🚿', 
        icon: '🚿' 
      });
      await addStorageLocation({ 
        placeId: bathroom.id, 
        name: t('locations.medicineCabinetName'), 
        description: '🧼' 
      });

      await reloadData();
      addToast(t('onboarding.initSuccess'), 'success');
    } catch (err) {
      console.error(err);
      addToast(t('common.error'), 'error');
    } finally {
      setIsInitializing(false);
    }
  };

  const handleSubmit = async (itemData) => {
    try {
      await addItem(itemData);
      addToast(t('item.addSuccess'), 'success');
      navigate('/inventory');
    } catch (err) {
      addToast(t('common.error'), 'error');
    }
  };

  const handleCancel = () => {
    navigate('/inventory');
  };

  const hasNoLocations = places.length === 0;

  return (
    <div className="add-item-page animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 className="page-title">{t('inventory.addItem')}</h1>
        </div>

        {/* Form Mode Toggle Tabs (only if locations exist) */}
        {!hasNoLocations && (
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
        )}
      </div>

      <GuidingBoard pageKey="addItem" />

      {hasNoLocations ? (
        <div className="glass-card safeguard-block-card animate-scale-in" style={{ padding: 'var(--space-8)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)', borderRadius: 'var(--radius-lg)' }}>
          <div className="safeguard-icon-wrapper" style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(26, 115, 232, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={28} />
          </div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>{t('onboarding.blockTitle')}</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.5, fontSize: 'var(--font-size-sm)' }}>{t('onboarding.blockSubtitle')}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', width: '100%', maxWidth: '320px', marginTop: 'var(--space-2)' }}>
            <Button 
              variant="primary" 
              onClick={handleAutoInit} 
              loading={isInitializing} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '28px', width: '100%' }}
            >
              <Sparkles size={16} />
              <span>{t('onboarding.quickInit')}</span>
              <ArrowRight size={16} />
            </Button>
            <Button 
              variant="text" 
              onClick={() => navigate('/locations')} 
              disabled={isInitializing} 
              style={{ width: '100%', borderRadius: '28px', color: 'var(--text-secondary)' }}
            >
              <span>{t('onboarding.customInit')}</span>
            </Button>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)' }}>
          {addMode === 'quick' ? (
            <QuickAddWizard onSubmit={handleSubmit} onCancel={handleCancel} />
          ) : (
            <ItemForm onSubmit={handleSubmit} onCancel={handleCancel} />
          )}
        </div>
      )}
    </div>
  );
}
