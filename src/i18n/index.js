import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import zhCN from './zh-CN.json';

const savedLang = localStorage.getItem('homestorage-language') || 'zh-CN';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    'zh-CN': { translation: zhCN },
  },
  lng: savedLang,
  fallbackLng: 'zh-CN',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
