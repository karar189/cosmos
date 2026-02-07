import { useTranslation as useI18nTranslation } from 'react-i18next';
import i18n from '@/locales/i18n';

const useTranslation: typeof useI18nTranslation = (ns, options) => {
  return useI18nTranslation(ns, {
    ...options,
    i18n,
  });
};

export default useTranslation;
