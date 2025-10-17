import { ko } from './ko';
import { en } from './en';
import { Language } from '../stores/languageStore';

export const translations = {
  ko,
  en,
};

export type TranslationKey = keyof typeof ko;

export const getTranslation = (language: Language, key: string, params?: Record<string, string>): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      console.warn(`Translation key "${key}" not found for language "${language}"`);
      return key;
    }
  }
  
  if (typeof value !== 'string') {
    console.warn(`Translation key "${key}" is not a string for language "${language}"`);
    return key;
  }
  
  // Replace placeholders with parameters
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey] || match;
    });
  }
  
  return value;
};
