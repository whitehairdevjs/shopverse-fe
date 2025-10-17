import { useLanguageStore } from '../stores/languageStore';
import { getTranslation } from '../locales';

export const useTranslation = () => {
  const { language } = useLanguageStore();
  
  const t = (key: string, params?: Record<string, string>) => {
    return getTranslation(language, key, params);
  };
  
  return { t, language };
};
