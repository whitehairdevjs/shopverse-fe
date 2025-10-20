import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export type Language = 'ko' | 'en';

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageStore>()(
  devtools(
    persist(
      (set, get) => ({
        language: 'ko',
        setLanguage: (language: Language) => set({ language }),
        toggleLanguage: () => {
          const currentLanguage = get().language;
          set({ language: currentLanguage === 'ko' ? 'en' : 'ko' });
        },
      }),
      {
        name: 'language-storage',
      }
    ),
    { name: 'language-store', enabled: process.env.NODE_ENV === 'development' }
  )
);
