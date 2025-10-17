'use client';

import { useLanguageStore } from '../../stores/languageStore';
import { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (langCode: string) => {
    setLanguage(langCode as 'ko' | 'en');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selectbox 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group relative flex items-center justify-between w-28 px-3 py-2 
          rounded-lg border border-gray-300 transition-all duration-300 ease-out
          transform hover:scale-105 active:scale-95
          ${isOpen 
            ? 'bg-orange-50 border-orange-400 shadow-md' 
            : 'bg-white hover:border-orange-400 hover:shadow-sm'
          }
        `}
        title="언어 선택"
      >
        {/* 현재 선택된 언어 */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-gray-700">
            {currentLanguage.name}
          </span>
        </div>
        
        {/* 드롭다운 화살표 */}
        <svg 
          className={`
            w-4 h-4 transition-all duration-300 text-gray-500
            ${isOpen ? 'rotate-180' : 'rotate-0'}
          `}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 드롭다운 메뉴 */}
      <div className={`
        absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 
        rounded-lg shadow-lg overflow-hidden transition-all duration-300 z-50
        ${isOpen 
          ? 'opacity-100 visible translate-y-0' 
          : 'opacity-0 invisible -translate-y-2'
        }
      `}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageSelect(lang.code)}
            className={`
              w-full flex items-center space-x-3 px-4 py-3 text-left
              transition-all duration-200 hover:bg-orange-50
              ${language === lang.code 
                ? 'bg-orange-100 text-orange-700 font-semibold' 
                : 'text-gray-700 hover:text-orange-600'
              }
            `}
          >
            <span className="text-sm font-medium">
              {lang.name}
            </span>
            {language === lang.code && (
              <svg 
                className="w-4 h-4 ml-auto text-orange-500" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
