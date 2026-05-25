import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import './LanguageSwitcher.css';

export function LanguageSwitcher({ variant = 'default' }) {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'zh-CN', label: '中文' },
  ];

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('instock-language', code);
  };

  return (
    <div className={`lang-switcher lang-switcher-${variant}`}>
      <Globe className="lang-switcher-icon" size={16} />
      <div className="lang-switcher-options">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`lang-option ${i18n.language === lang.code ? 'lang-option-active' : ''}`}
            onClick={() => handleChange(lang.code)}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
