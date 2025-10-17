'use client';

import { useLanguageStore } from '../../stores/languageStore';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:border-orange-500 hover:text-orange-500 transition-colors bg-white"
      title={language === 'ko' ? 'Switch to English' : '한국어로 전환'}
    >
      <span className="text-lg font-medium">
        {language === 'ko' ? '🇰🇷' : '🇺🇸'}
      </span>
      <span className="text-sm font-medium">
        {language === 'ko' ? '한국어' : 'English'}
      </span>
    </button>
  );
}
