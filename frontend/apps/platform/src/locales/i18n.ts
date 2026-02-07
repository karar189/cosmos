import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './en';

export const resources = {
  en: enTranslation,
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false, // Disable suspense for Next.js App Router compatibility
  },
});

export default i18n;
