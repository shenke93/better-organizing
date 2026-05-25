import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Sun, Moon, Globe, Download, Upload, Trash2, Info, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useInventory } from '../context/InventoryContext';
import { useToast } from '../components/ui/Toast';
import { exportToJSON, importFromJSON } from '../utils/export';
import { Button } from '../components/ui/Button';
import { GuidingBoard } from '../components/ui/GuidingBoard';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const { clearAll, reloadData } = useInventory();
  const { addToast } = useToast();

  const fileInputRef = useRef(null);
  const [importMode, setImportMode] = useState('merge'); // 'merge' | 'replace'

  // Language Change handler
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('instock-language', lang);
    addToast(t('common.success'), 'success');
  };

  // Export Data handler
  const handleExport = async () => {
    try {
      await exportToJSON();
      addToast(t('settings.exportSuccess'), 'success');
    } catch (err) {
      addToast(t('common.error'), 'error');
    }
  };

  // Trigger Import dialog
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Import Data File handler
  const handleFileImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Double confirmation if replacing all data
    if (importMode === 'replace') {
      const confirmReplace = window.confirm(t('settings.clearConfirm'));
      if (!confirmReplace) {
        e.target.value = '';
        return;
      }
    }

    try {
      const result = await importFromJSON(file, importMode);
      await reloadData();
      addToast(
        t('settings.importSuccess') + ` (${result.items} items, ${result.places} places)`, 
        'success'
      );
    } catch (err) {
      addToast(t('settings.importError'), 'error');
    } finally {
      e.target.value = ''; // clear input
    }
  };

  // Clear Data handler
  const handleClearData = async () => {
    const confirmClear = window.confirm(t('settings.clearConfirm'));
    if (confirmClear) {
      try {
        await clearAll();
        addToast(t('settings.clearSuccess'), 'success');
      } catch (err) {
        addToast(t('common.error'), 'error');
      }
    }
  };

  return (
    <div className="settings-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">{t('settings.title')}</h1>
        <p className="page-subtitle">{t('settings.subtitle')}</p>
      </div>

      <GuidingBoard pageKey="settings" />

      <div className="settings-grid">
        {/* Appearance Section */}
        <div className="settings-card glass-card">
          <h2 className="settings-card-title">{t('settings.appearance')}</h2>
          
          <div className="settings-row">
            <div className="settings-label-col">
              <span className="settings-label">{t('settings.theme')}</span>
              <span className="settings-desc">
                {theme === 'dark' ? t('settings.darkMode') : t('settings.lightMode')}
              </span>
            </div>
            <button 
              className="layout-toggle-btn" 
              onClick={toggleTheme}
              title={theme === 'dark' ? t('settings.lightMode') : t('settings.darkMode')}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          <div className="settings-row" style={{ marginTop: 'var(--space-2)' }}>
            <div className="settings-label-col">
              <span className="settings-label">{t('settings.language')}</span>
              <span className="settings-desc">
                {i18n.language === 'zh-CN' ? '简体中文' : 'English'}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button 
                variant={i18n.language === 'en' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleLanguageChange('en')}
              >
                English
              </Button>
              <Button 
                variant={i18n.language === 'zh-CN' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleLanguageChange('zh-CN')}
              >
                简体中文
              </Button>
            </div>
          </div>
        </div>

        {/* Data Management Section */}
        <div className="settings-card glass-card">
          <h2 className="settings-card-title">{t('settings.data')}</h2>

          {/* Export */}
          <div className="settings-row">
            <div className="settings-label-col">
              <span className="settings-label">{t('settings.exportData')}</span>
              <span className="settings-desc">{t('settings.exportDescription')}</span>
            </div>
            <Button variant="secondary" icon={Download} onClick={handleExport}>
              {t('settings.exportData')}
            </Button>
          </div>

          {/* Import mode options */}
          <div className="settings-row" style={{ borderTop: '1px solid var(--divider-color)', paddingTop: 'var(--space-4)' }}>
            <div className="settings-label-col">
              <span className="settings-label">{t('settings.importMode')}</span>
              <span className="settings-desc">{t('settings.importDescription')}</span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <Button 
                variant={importMode === 'merge' ? 'primary' : 'secondary'} 
                size="sm"
                onClick={() => setImportMode('merge')}
              >
                {t('settings.importMerge')}
              </Button>
              <Button 
                variant={importMode === 'replace' ? 'danger' : 'secondary'} 
                size="sm"
                onClick={() => setImportMode('replace')}
              >
                {t('settings.importReplace')}
              </Button>
            </div>
          </div>

          {/* Import */}
          <div className="settings-row" style={{ borderTop: '1px solid var(--divider-color)', paddingTop: 'var(--space-4)' }}>
            <div className="settings-label-col">
              <span className="settings-label">{t('settings.importData')}</span>
              <span className="settings-desc">
                {importMode === 'merge' ? t('settings.importMerge') : t('settings.importReplace')}
              </span>
            </div>
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="file-import-input" 
                accept=".json"
                onChange={handleFileImport}
              />
              <Button variant="secondary" icon={Upload} onClick={handleImportClick}>
                {t('settings.importData')}
              </Button>
            </div>
          </div>

          {/* Clear Data */}
          <div className="settings-row" style={{ borderTop: '1px solid var(--divider-color)', paddingTop: 'var(--space-4)' }}>
            <div className="settings-label-col">
              <span className="settings-label" style={{ color: 'var(--status-expired)' }}>
                {t('settings.clearData')}
              </span>
              <span className="settings-desc">{t('settings.clearDescription')}</span>
            </div>
            <Button variant="danger" icon={Trash2} onClick={handleClearData}>
              {t('settings.clearData')}
            </Button>
          </div>
        </div>

        {/* About Section */}
        <div className="settings-card glass-card">
          <h2 className="settings-card-title">{t('settings.about')}</h2>
          <div className="settings-row">
            <div className="settings-label-col" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Info size={24} style={{ color: 'var(--accent-primary)' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="settings-label">{t('app.name')}</span>
                <span className="settings-desc">{t('app.tagline')}</span>
              </div>
            </div>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-secondary)' }}>
              {t('settings.version')}: v1.2.0
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
