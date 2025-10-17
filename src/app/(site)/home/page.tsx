'use client';

import { useTranslation } from '../../../hooks/useTranslation';
import { useCategories } from '../product/hooks/useCategories';
import Link from 'next/link';

export default function HomePage() {
  const { t } = useTranslation();
  const { categoryHierarchy, loading, error } = useCategories();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* 메인 배너 */}
        <section className="mb-8 sm:mb-10 lg:mb-12">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-4 sm:p-6 lg:p-8 text-white">
            <div className="max-w-2xl mx-auto sm:mx-0">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-center sm:text-left">{t('home.banner.title')}</h2>
              <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 text-center sm:text-left">{t('home.banner.description')}</p>
              <div className="text-center sm:text-left">
                <button className="bg-white text-orange-500 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base w-full sm:w-auto">
                  {t('home.banner.cta')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 카테고리 */}
        <section className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{t('home.categories.title')}</h2>
            <Link href="/product" className="text-orange-500 hover:text-orange-600 font-medium text-sm sm:text-base self-end sm:self-auto">
              {t('home.categories.more')}
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-orange-500"></div>
                <span className="text-gray-600 text-sm sm:text-base">카테고리를 불러오는 중...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600 text-sm sm:text-base">
              카테고리를 불러오는데 실패했습니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {categoryHierarchy.mainCategories.slice(0, 6).map((category, index) => {
                // 카테고리별 이모지 매핑
                const categoryEmojis = ['📱', '👕', '🏠', '⚽', '💄', '📚', '🎮', '🍎', '🚗', '💻'];
                const emoji = categoryEmojis[index] || '📦';
                
                return (
                  <Link
                    key={category.id}
                    href={`/product?mainCategoryId=${category.id}`}
                    className="bg-white p-3 sm:p-4 lg:p-6 rounded-lg text-center hover:shadow-md transition-all duration-200 hover:scale-105 group min-h-[100px] sm:min-h-[120px] flex flex-col justify-center"
                  >
                    <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-200">
                      {emoji}
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors text-xs sm:text-sm lg:text-base leading-tight">
                      {category.name}
                    </h3>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* 라이브 쇼핑 */}
        <section className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{t('home.live.title')}</h2>
            <Link href="/live" className="text-orange-500 hover:text-orange-600 font-medium text-sm sm:text-base self-end sm:self-auto">
              {t('home.live.more')}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              { 
                title: '🔥 오늘의 특가 라이브', 
                host: 'ShopVerse 공식', 
                viewers: '1,234명 시청 중',
                thumbnail: '📺',
                discount: '최대 70% 할인'
              },
              { 
                title: '💄 뷰티 아이템 특가', 
                host: '뷰티 전문가 김미영', 
                viewers: '856명 시청 중',
                thumbnail: '💄',
                discount: '최대 50% 할인'
              },
              { 
                title: '👕 패션 위크 특집', 
                host: '스타일리스트 박민수', 
                viewers: '2,103명 시청 중',
                thumbnail: '👗',
                discount: '최대 60% 할인'
              }
            ].map((live, index) => (
              <Link
                key={index}
                href="/live"
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="bg-gradient-to-r from-orange-400 to-red-500 h-24 sm:h-28 lg:h-32 flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl relative">
                  <span className="text-white">{live.thumbnail}</span>
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    LIVE
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {live.viewers}
                  </div>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-gray-900 mb-1 group-hover:text-orange-500 transition-colors text-sm sm:text-base leading-tight">
                    {live.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2">{live.host}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-500 font-semibold text-xs sm:text-sm">{live.discount}</span>
                    <span className="text-xs text-gray-500">지금 시청하기 →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 베스트 상품 */}
        <section className="mb-8 sm:mb-10 lg:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{t('home.bestProducts.title')}</h2>
            <Link href="/product" className="text-orange-500 hover:text-orange-600 font-medium text-sm sm:text-base self-end sm:self-auto">
              {t('home.bestProducts.more')}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: 'iPhone 15 Pro', price: '₩1,250,000', image: '📱' },
              { name: 'Galaxy S24', price: '₩1,199,000', image: '📱' },
              { name: 'MacBook Air', price: '₩1,899,000', image: '💻' },
              { name: 'Sony 헤드폰', price: '₩399,000', image: '🎧' }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                <div className="bg-gray-100 h-32 sm:h-36 lg:h-40 flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl group-hover:scale-105 transition-transform duration-200">
                  {product.image}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base leading-tight">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base sm:text-lg font-bold text-gray-900">{product.price}</span>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 sm:py-2.5 px-3 sm:px-4 rounded transition-colors text-xs sm:text-sm">
                    {t('home.bestProducts.addToCart')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 