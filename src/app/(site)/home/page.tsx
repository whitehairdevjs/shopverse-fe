'use client';

import { useTranslation } from '../../../hooks/useTranslation';

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('home.title')}</h1>
        
        {/* 메인 배너 */}
        <section className="mb-12">
                           <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-8 text-white">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold mb-4">{t('home.banner.title')}</h2>
              <p className="text-lg mb-6">{t('home.banner.description')}</p>
                                   <button className="bg-white text-orange-500 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors">
                {t('home.banner.cta')}
              </button>
            </div>
          </div>
        </section>

        {/* 카테고리 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('home.categories.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: t('home.categories.electronics'), icon: '📱' },
              { name: t('home.categories.fashion'), icon: '👕' },
              { name: t('home.categories.home'), icon: '🏠' },
              { name: t('home.categories.sports'), icon: '⚽' }
            ].map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* 베스트 상품 */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('home.bestProducts.title')}</h2>
                               <a href="/product" className="text-orange-500 hover:text-orange-600 font-medium">{t('home.bestProducts.more')}</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'iPhone 15 Pro', price: '₩1,250,000', image: '📱' },
              { name: 'Galaxy S24', price: '₩1,199,000', image: '📱' },
              { name: 'MacBook Air', price: '₩1,899,000', image: '💻' },
              { name: 'Sony 헤드폰', price: '₩399,000', image: '🎧' }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="bg-gray-100 h-40 flex items-center justify-center text-4xl">
                  {product.image}
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">{product.price}</span>
                  </div>
                                           <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors">
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