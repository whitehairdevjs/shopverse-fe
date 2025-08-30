'use client';

import { useState, useEffect } from 'react';
import { useCategories } from './hooks/useCategories';

export default function ProductPage() {
  const { categoryHierarchy, loading, error } = useCategories();
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('');
  const [selectedDetailCategory, setSelectedDetailCategory] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<string>('');

  useEffect(() => {
    setSelectedSubCategory('');
    setSelectedDetailCategory('');
  }, [selectedMainCategory]);

  useEffect(() => {
    setSelectedDetailCategory('');
  }, [selectedSubCategory]);

  const currentSubCategories = selectedMainCategory 
    ? categoryHierarchy.subCategories.filter(cat => cat.parentId === parseInt(selectedMainCategory))
    : [];

  const currentDetailCategories = selectedSubCategory 
    ? categoryHierarchy.detailCategories.filter(cat => cat.parentId === parseInt(selectedSubCategory))
    : [];

  const handleFilterApply = () => {
  };

  const getSelectedCategoryPath = () => {
    const path: string[] = [];
    
    if (selectedMainCategory) {
      const mainCat = categoryHierarchy.mainCategories.find(cat => cat.id === parseInt(selectedMainCategory));
      if (mainCat) path.push(mainCat.name);
    }
    
    if (selectedSubCategory) {
      const subCat = categoryHierarchy.subCategories.find(cat => cat.id === parseInt(selectedSubCategory));
      if (subCat) path.push(subCat.name);
    }
    
    if (selectedDetailCategory) {
      const detailCat = categoryHierarchy.detailCategories.find(cat => cat.id === parseInt(selectedDetailCategory));
      if (detailCat) path.push(detailCat.name);
    }
    
    return path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">상품 목록</h1>
        
        {/* 필터 및 정렬 */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* 대분류 선택 */}
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={selectedMainCategory}
              onChange={(e) => setSelectedMainCategory(e.target.value)}
              disabled={loading}
            >
              <option value="">대분류 선택</option>
              {loading ? (
                <option disabled>로딩 중...</option>
              ) : error ? (
                <option disabled>오류 발생</option>
              ) : (
                categoryHierarchy.mainCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
            
            {/* 중분류 선택 (대분류가 선택된 경우에만 표시) */}
            {selectedMainCategory && currentSubCategories.length > 0 && (
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
              >
                <option value="">중분류 선택</option>
                {currentSubCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
            
            {/* 소분류 선택 (중분류가 선택되고 소분류가 있는 경우에만 표시) */}
            {selectedSubCategory && currentDetailCategories.length > 0 && (
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={selectedDetailCategory}
                onChange={(e) => setSelectedDetailCategory(e.target.value)}
              >
                <option value="">소분류 선택</option>
                {currentDetailCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
            
            {/* 정렬 선택 */}
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
            >
              <option value="">정렬</option>
              <option value="latest">최신순</option>
              <option value="price-low">가격낮은순</option>
              <option value="price-high">가격높은순</option>
            </select>
            
            {/* 필터 적용 버튼 */}
            <button 
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleFilterApply}
              disabled={loading || (!selectedMainCategory && !selectedSort)}
            >
              필터 적용
            </button>
          </div>
          
          {/* 선택된 카테고리 경로 표시 */}
          {getSelectedCategoryPath().length > 0 && (
            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm text-blue-800">
                선택된 카테고리: <strong>{getSelectedCategoryPath().join(' > ')}</strong>
              </span>
            </div>
          )}
          
          {/* 에러 메시지 표시 */}
          {error && (
            <div className="mt-2 text-red-600 text-sm">
              {error}
            </div>
          )}
          
          {/* 로딩 상태 표시 */}
          {loading && (
            <div className="mt-2 text-blue-600 text-sm">
              카테고리를 불러오는 중...
            </div>
          )}
        </div>

        {/* 상품 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[
            { name: 'iPhone 15 Pro', price: '₩1,250,000', originalPrice: '₩1,550,000', discount: '19%', image: '📱' },
            { name: 'Galaxy S24', price: '₩1,199,000', originalPrice: '₩1,399,000', discount: '14%', image: '📱' },
            { name: 'MacBook Air', price: '₩1,899,000', originalPrice: '₩2,199,000', discount: '14%', image: '💻' },
            { name: 'Sony 헤드폰', price: '₩399,000', originalPrice: '₩499,000', discount: '20%', image: '🎧' },
            { name: 'Nike 운동화', price: '₩89,000', originalPrice: '₩159,000', discount: '44%', image: '👟' },
            { name: 'Adidas 운동화', price: '₩129,000', originalPrice: '₩229,000', discount: '44%', image: '👟' },
            { name: 'Under Armour', price: '₩79,000', originalPrice: '₩139,000', discount: '43%', image: '👟' },
            { name: 'Apple Watch', price: '₩599,000', originalPrice: '₩799,000', discount: '25%', image: '⌚' }
          ].map((product, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="bg-gray-100 h-48 flex items-center justify-center text-4xl">
                {product.image}
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">{product.price}</span>
                  <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                    {product.discount}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors">
                    장바구니
                  </button>
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
                    구매하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">이전</button>
            <button className="px-3 py-2 bg-orange-500 text-white rounded-lg">1</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">다음</button>
          </nav>
        </div>
      </div>
    </div>
  );
} 