import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, MapPin, Layers, Layout, ArrowRight } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from './Toast';
import { Button } from './Button';
import './OnboardingModal.css';

export function OnboardingModal({ isOpen, onClose }) {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const { addPlace, addStorageLocation, reloadData } = useInventory();
  const [isInitializing, setIsInitializing] = useState(false);

  if (!isOpen) return null;

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('homestorage-language', lang);
  };

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

  return createPortal(
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

        {/* Dynamic Theme & Language Segment Pickers */}
        <div className="onboarding-customizer">
          <h3 className="customizer-section-title">{t('onboarding.customize')}</h3>
          <div className="customizer-pickers-grid">
            <div className="picker-row">
              <span className="picker-label">{t('onboarding.selectLanguage')}</span>
              <div className="segmented-toggle">
                <button
                  type="button"
                  className={`segment-btn ${i18n.language === 'zh-CN' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('zh-CN')}
                >
                  简体中文
                </button>
                <button
                  type="button"
                  className={`segment-btn ${i18n.language === 'en' ? 'active' : ''}`}
                  onClick={() => handleLanguageChange('en')}
                >
                  English
                </button>
              </div>
            </div>

            <div className="picker-row">
              <span className="picker-label">{t('onboarding.selectTheme')}</span>
              <div className="segmented-toggle">
                <button
                  type="button"
                  className={`segment-btn ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  {t('onboarding.light')}
                </button>
                <button
                  type="button"
                  className={`segment-btn ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  {t('onboarding.dark')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Local storage privacy & install reminders */}
        <div className="onboarding-privacy-alert">
          <p className="privacy-alert-text">{t('onboarding.localNotice')}</p>
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
    </div>,
    document.body
  );
}
