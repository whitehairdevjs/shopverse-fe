'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '../../stores/languageStore';

interface LanguageProviderProps {
  children: React.ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const { language } = useLanguageStore();

  useEffect(() => {
    // Update HTML lang attribute when language changes
    document.documentElement.lang = language;
  }, [language]);

  return <>{children}</>;
}
