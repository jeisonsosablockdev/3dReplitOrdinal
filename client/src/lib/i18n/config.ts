import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import es from './es';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    resources: {
      en: {
        translation: en,
      },
      es: {
        translation: es,
      },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
