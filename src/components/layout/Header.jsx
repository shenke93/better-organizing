import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import './Header.css';

export function Header({ title, subtitle, actions }) {
  return (
    <header className="page-header">
      <div className="page-header-left">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      <div className="page-header-right">
        {actions}
        <LanguageSwitcher />
      </div>
    </header>
  );
}
