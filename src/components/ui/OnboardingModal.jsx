import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, MapPin, Layers, Layout, ArrowRight } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useToast } from './Toast';
import { Button } from './Button';
import './OnboardingModal.css';

export function OnboardingModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { addPlace, addStorageLocation, reloadData } = useInventory();
  const [isInitializing, setIsInitializing] = useState(false);

  if (!isOpen) return null;

  const handleAutoInit = async () => {
    setIsInitializing(true);
    try {
      // 1. Kitchen
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

      // 2. Bedroom
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

      // 3. Living Room
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

      // 4. Bathroom
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
      onClose();
    } catch (err) {
      console.error(err);
      addToast(t('common.error'), 'error');
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card animate-scale-in" role="dialog" aria-modal="true">
        <div className="onboarding-brand">
          <div className="brand-logo-icon">
            <Sparkles size={28} />
          </div>
          <h2 className="onboarding-title">{t('onboarding.welcome')}</h2>
          <p className="onboarding-subtitle">{t('onboarding.welcomeSubtitle')}</p>
        </div>

        <div className="onboarding-steps">
          <div className="onboarding-step-item">
            <div className="step-icon-wrapper">
              <MapPin size={18} />
            </div>
            <div className="step-text-wrapper">
              <span className="step-desc">{t('onboarding.step1')}</span>
            </div>
          </div>
          <div className="onboarding-step-item">
            <div className="step-icon-wrapper">
              <Layers size={18} />
            </div>
            <div className="step-text-wrapper">
              <span className="step-desc">{t('onboarding.step2')}</span>
            </div>
          </div>
          <div className="onboarding-step-item">
            <div className="step-icon-wrapper">
              <Layout size={18} />
            </div>
            <div className="step-text-wrapper">
              <span className="step-desc">{t('onboarding.step3')}</span>
            </div>
          </div>
        </div>

        <div className="onboarding-actions">
          <Button 
            variant="primary" 
            onClick={handleAutoInit} 
            loading={isInitializing}
            className="btn-auto-init"
          >
            <Sparkles size={16} />
            <span>{t('onboarding.quickInit')}</span>
            <ArrowRight size={16} />
          </Button>

          <Button 
            variant="text" 
            onClick={onClose}
            disabled={isInitializing}
            className="btn-manual-setup"
          >
            <span>{t('onboarding.customInit')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
