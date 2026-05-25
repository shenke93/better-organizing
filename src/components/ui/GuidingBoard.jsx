import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, X } from 'lucide-react';
import './GuidingBoard.css';

export function GuidingBoard({ pageKey }) {
  const { t } = useTranslation();
  const storageKey = `homestorage-guide-dismissed-${pageKey}`;

  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem(storageKey) === 'true';
  });

  if (isDismissed) return null;

  const handleDismiss = () => {
    localStorage.setItem(storageKey, 'true');
    setIsDismissed(true);
  };

  return (
    <div className="guiding-board animate-fade-in-up">
      <div className="guide-icon-wrapper">
        <HelpCircle size={18} />
      </div>
      <div className="guide-text-content">
        <p className="guide-text-message">{t(`guides.${pageKey}`)}</p>
      </div>
      <button 
        type="button" 
        className="guide-dismiss-btn" 
        onClick={handleDismiss} 
        aria-label={t('onboarding.dismissGuide')}
        title={t('onboarding.dismissGuide')}
      >
        <X size={16} />
      </button>
    </div>
  );
}
