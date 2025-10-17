'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { authUtils } from '../../utils/api';
import { useTranslation } from '../../hooks/useTranslation';
import LanguageToggle from './LanguageToggle';
import Link from 'next/link';

export default function Header() {
  const { isAuthenticated, member } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            {/* 로고 */}
            <div className="flex items-center">
              <Link href="/home" className="text-xl sm:text-2xl font-bold text-orange-500">
                ShopVerse
              </Link>
            </div>
            
            {/* 검색바 - 데스크톱에서만 표시 */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="찾고 싶은 상품을 검색해보세요"
                  className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* 우측 메뉴 - 기본 상태 */}
            <div className="flex items-center space-x-3 sm:space-x-6">
              {/* 모바일 검색 버튼 */}
              <button className="lg:hidden text-gray-700 hover:text-orange-500 transition-colors p-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              <Link href="/login" className="hidden sm:flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span className="text-sm">로그인</span>
              </Link>
              
              {/* 장바구니 */}
              <Link href="/cart" className="text-gray-700 hover:text-orange-500 transition-colors p-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>
              
              {/* 모바일 메뉴 버튼 */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden text-gray-700 hover:text-orange-500 transition-colors p-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* 모바일 메뉴 */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <div className="space-y-4">
                <Link href="/login" className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors py-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>로그인</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    );
  }

  const handleLogout = async () => {
    await authUtils.logout();
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* 로고 */}
          <div className="flex items-center">
            <Link href="/home" className="text-xl sm:text-2xl font-bold text-orange-500">
              ShopVerse
            </Link>
          </div>
          
          {/* 검색바 - 데스크톱에서만 표시 */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder={t('nav.search')}
                className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* 우측 메뉴 */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            {/* 모바일 검색 버튼 */}
            <button className="lg:hidden text-gray-700 hover:text-orange-500 transition-colors p-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* 언어 선택 - 데스크톱에서만 표시 */}
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>
            
            {/* 사용자 프로필 */}
            {isAuthenticated ? (
              <div className="hidden sm:flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  {t('nav.hello', { name: member?.name || 'unknown' })}
                </span>                
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm text-gray-700 hover:text-orange-500 transition-colors"
                  title={t('nav.logout')}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>{t('nav.logout')}</span>
                </button>
              </div>
            ) : (
              <Link href="/login" className="hidden sm:flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span className="text-sm">{t('nav.login')}</span>
              </Link>
            )}
            
            {/* 마이페이지 */}
            {isAuthenticated && (
              <Link 
                href="/mypage" 
                className="text-gray-700 hover:text-orange-500 transition-colors p-2"
                title={t('nav.mypage')}
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}

            {/* 장바구니 */}
            {isAuthenticated && (
              <Link href="/cart" className="text-gray-700 hover:text-orange-500 transition-colors p-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </Link>
            )}
            
            {/* 모바일 메뉴 버튼 */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-orange-500 transition-colors p-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              {/* 모바일 검색바 */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder={t('nav.search')}
                  className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              {/* 모바일 언어 선택 */}
              <div className="flex justify-center">
                <LanguageToggle />
              </div>
              
              {/* 모바일 사용자 메뉴 */}
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="text-center py-2">
                    <span className="text-sm text-gray-700">
                      {t('nav.hello', { name: member?.name || 'unknown' })}
                    </span>
                  </div>
                  <Link 
                    href="/mypage" 
                    className="flex items-center justify-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors py-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{t('nav.mypage')}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center justify-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors py-2 w-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>{t('nav.logout')}</span>
                  </button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center justify-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors py-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span>{t('nav.login')}</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 