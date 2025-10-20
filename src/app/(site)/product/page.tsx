'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCategories } from './hooks/useCategories';
import { useProducts } from './hooks/useProducts';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { useCategoryStore } from '@/stores/categoryStore';
import Toast from '@/components/common/Toast';
import type { ProductListParams, Product } from './types';

export default function ProductPage() {
  const { categoryHierarchy, categoryOptions, loading: categoriesLoading, error: categoriesError } = useCategories();
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const { 
    selectedMainCategory: storeMainCategory, 
    selectedSubCategory: storeSubCategory, 
    selectedDetailCategory: storeDetailCategory, 
    setSelectedMainCategory: setStoreMainCategory,
    setSelectedSubCategory: setStoreSubCategory,
    setSelectedDetailCategory: setStoreDetailCategory,
    clearSelection 
  } = useCategoryStore();
  
  const [selectedSort, setSelectedSort] = useState<'latest' | 'price-low' | 'price-high' | 'popular' | 'rating' | ''>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  
  // 토스트 상태
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'info',
    isVisible: false,
  });

  // 상품 조회 파라미터 설정 (스토어 값 직접 사용)
  const productParams: ProductListParams = {
    categoryId: storeMainCategory ? parseInt(storeMainCategory) : undefined,
    subCategoryId: storeSubCategory ? parseInt(storeSubCategory) : undefined,
    detailCategoryId: storeDetailCategory ? parseInt(storeDetailCategory) : undefined,
    sort: selectedSort || undefined,
    page,
    size: pageSize,
  };

  // 상품 데이터 조회
  const { products, loading: productsLoading, error: productsError, pagination } = useProducts(productParams);

  // 대분류 변경 시 하위 카테고리 초기화 핸들러
  const handleMainCategoryChange = (categoryId: string) => {
    setStoreMainCategory(categoryId);
    setStoreSubCategory('');
    setStoreDetailCategory('');
    setPage(1);
  };

  // 중분류 변경 시 하위 카테고리 초기화 핸들러
  const handleSubCategoryChange = (categoryId: string) => {
    setStoreSubCategory(categoryId);
    setStoreDetailCategory('');
    setPage(1);
  };

  // 소분류 변경 핸들러
  const handleDetailCategoryChange = (categoryId: string) => {
    setStoreDetailCategory(categoryId);
    setPage(1);
  };

  const currentSubCategories = storeMainCategory 
    ? categoryHierarchy.subCategories.filter(cat => cat.parentId === parseInt(storeMainCategory))
    : [];

  const currentDetailCategories = storeSubCategory 
    ? categoryHierarchy.detailCategories.filter(cat => cat.parentId === parseInt(storeSubCategory))
    : [];

  const getPageNumbers = () => {
    const total = pagination?.totalPages || 1;
    const current = pagination?.currentPage || 1;
    const windowSize = 5;
    const start = Math.max(1, current - Math.floor(windowSize / 2));
    const end = Math.min(total, start + windowSize - 1);
    const pages = [] as number[];
    for (let i = Math.max(1, end - windowSize + 1); i <= end; i++) pages.push(i);
    return pages;
  };

  const getSelectedCategoryPath = () => {
    const path: { name: string; id: string; href: string }[] = [];
    
    if (storeMainCategory) {
      const mainCat = categoryHierarchy.mainCategories.find(cat => cat.id === parseInt(storeMainCategory));
      if (mainCat) {
        path.push({
          name: mainCat.name,
          id: mainCat.id.toString(),
          href: `/product`
        });
      }
    }
    
    if (storeSubCategory) {
      const subCat = categoryHierarchy.subCategories.find(cat => cat.id === parseInt(storeSubCategory));
      if (subCat) {
        path.push({
          name: subCat.name,
          id: subCat.id.toString(),
          href: `/product`
        });
      }
    }
    
    if (storeDetailCategory) {
      const detailCat = categoryHierarchy.detailCategories.find(cat => cat.id === parseInt(storeDetailCategory));
      if (detailCat) {
        path.push({
          name: detailCat.name,
          id: detailCat.id.toString(),
          href: `/product`
        });
      }
    }
    
    return path;
  };

  // 현재 선택된 메인 카테고리 정보
  const currentMainCategory = storeMainCategory 
    ? categoryHierarchy.mainCategories.find(cat => cat.id === parseInt(storeMainCategory))
    : null;

  // 토스트 표시 함수
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({
      message,
      type,
      isVisible: true,
    });
  };

  // 토스트 닫기 함수
  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // 장바구니 추가 함수
  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      showToast('로그인이 필요합니다. 로그인 페이지로 이동합니다.', 'warning');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return;
    }

    try {
      addItem({
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        image: '', // 실제 이미지 URL이 있다면 여기에 추가
      });
      showToast(`${product.name}이(가) 장바구니에 추가되었습니다.`, 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '장바구니 추가 중 오류가 발생했습니다.';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 페이지 제목 및 브레드크럼 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {currentMainCategory ? `${currentMainCategory.name} 상품` : '상품 목록'}
          </h1>
          
          {/* 브레드크럼 네비게이션 */}
          {/* {getSelectedCategoryPath().length > 0 && (
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <a href="/product" className="hover:text-orange-500 transition-colors">
                전체 상품
              </a>
              {getSelectedCategoryPath().map((category, index) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <a 
                    href={category.href}
                    className="hover:text-orange-500 transition-colors"
                  >
                    {category.name}
                  </a>
                </div>
              ))}
            </nav>
          )} */}
        </div>
        
        {/* 필터 및 정렬 */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            {/* 대분류 선택 */}
            <select 
              className={`border rounded-lg px-3 py-2 ${
                storeMainCategory 
                  ? 'border-orange-500 bg-orange-50 text-orange-700' 
                  : 'border-gray-300'
              }`}
              value={storeMainCategory}
              onChange={(e) => handleMainCategoryChange(e.target.value)}
              disabled={categoriesLoading}
            >
              {categoriesLoading ? (
                <option disabled>로딩 중...</option>
              ) : categoriesError ? (
                <option disabled>오류 발생</option>
              ) : (
                categoryOptions.mainCategoryOptions.map((category) => (
                  <option key={category.id} value={category.id === 0 ? '' : category.id}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
            
            {/* 중분류 선택 (대분류가 선택된 경우에만 표시) */}
            {storeMainCategory && (
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={storeSubCategory}
                onChange={(e) => handleSubCategoryChange(e.target.value)}
              >
                {currentSubCategories.length > 0 ? (
                  categoryOptions.subCategoryOptions
                    .filter(category => category.id === 0 || currentSubCategories.some(sub => sub.id === category.id))
                    .map((category) => (
                      <option key={category.id} value={category.id === 0 ? '' : category.id}>
                        {category.name}
                      </option>
                    ))
                ) : (
                  <option value="">중분류 없음</option>
                )}
              </select>
            )}
            
            {/* 소분류 선택 (중분류가 선택되고 소분류가 있는 경우에만 표시) */}
            {storeSubCategory && currentDetailCategories.length > 0 && (
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2"
                value={storeDetailCategory}
                onChange={(e) => handleDetailCategoryChange(e.target.value)}
              >
                {categoryOptions.detailCategoryOptions
                  .filter(category => category.id === 0 || currentDetailCategories.some(detail => detail.id === category.id))
                  .map((category) => (
                    <option key={category.id} value={category.id === 0 ? '' : category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            )}
            
            {/* 정렬 선택 */}
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={selectedSort}
              onChange={(e) => { setSelectedSort(e.target.value as 'latest' | 'price-low' | 'price-high' | 'popular' | 'rating' | ''); setPage(1); }}
            >
              <option value="">정렬</option>
              <option value="latest">최신순</option>
              <option value="price-low">가격낮은순</option>
              <option value="price-high">가격높은순</option>
            </select>
          </div>
          
          {/* 선택된 카테고리 정보 표시 */}
          {getSelectedCategoryPath().length > 0 && (
            <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-sm text-orange-800">
                    현재 선택: <strong>{getSelectedCategoryPath().map(cat => cat.name).join(' > ')}</strong>
                  </span>
                </div>
                <button 
                  onClick={() => {
                    clearSelection(); // 스토어 초기화
                  }}
                  className="text-xs text-orange-600 hover:text-orange-800 underline"
                >
                  필터 초기화
                </button>
              </div>
            </div>
          )}
          
          {/* 에러 메시지 표시 */}
          {(categoriesError || productsError) && (
            <div className="mt-2 text-red-600 text-sm">
              {categoriesError || productsError}
            </div>
          )}
          
          {/* 로딩 상태 표시 */}
          {(categoriesLoading || productsLoading) && (
            <div className="mt-2 text-blue-600 text-sm">
              {categoriesLoading ? '카테고리를 불러오는 중...' : '상품을 불러오는 중...'}
            </div>
          )}
        </div>

        {/* 상품 그리드 */}
        {productsLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <span className="text-gray-600">상품을 불러오는 중...</span>
            </div>
          </div>
        ) : productsError ? (
          <div className="text-center py-12">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">상품을 불러올 수 없습니다</h3>
            <p className="text-gray-500 mb-4">{productsError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {storeMainCategory ? '해당 카테고리에 상품이 없습니다' : '상품이 없습니다'}
            </h3>
            <p className="text-gray-500 mb-4">
              다른 카테고리를 선택하거나 필터를 조정해보세요
            </p>
            {storeMainCategory && (
              <button 
                onClick={() => {
                  clearSelection(); // 스토어 초기화
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                전체 상품 보기
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              // 가격 포맷팅 함수
              const formatPrice = (price: number) => {
                return new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW',
                  minimumFractionDigits: 0,
                }).format(price);
              };

              // 할인율 계산
              const discountPercent = product.comparePrice && product.price < product.comparePrice
                ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
                : 0;

              return (
                <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="bg-gray-100 h-48 flex items-center justify-center text-4xl">
                    📦
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    {product.subtitle && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">{product.subtitle}</p>
                    )}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.comparePrice && product.price < product.comparePrice && (
                        <>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.comparePrice)}
                          </span>
                          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded">
                            {discountPercent}%
                          </span>
                        </>
                      )}
                    </div>
                    {product.averageRating && (
                      <div className="flex items-center gap-1 mb-3">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(product.averageRating!) ? 'text-yellow-400' : 'text-gray-300'}>
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.reviewCount || 0})
                        </span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors"
                      >
                        장바구니
                      </button>
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
                        구매하기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}


        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6 sm:mt-8">
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              disabled={!pagination?.hasPrevious || productsLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={`px-2 sm:px-3 py-2 border rounded-lg text-sm ${(!pagination?.hasPrevious || productsLoading) ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              이전
            </button>
            {getPageNumbers().map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-2 sm:px-3 py-2 rounded-lg text-sm ${p === pagination?.currentPage ? 'bg-orange-500 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={!pagination?.hasNext || productsLoading}
              onClick={() => setPage((p) => p + 1)}
              className={`px-2 sm:px-3 py-2 border rounded-lg text-sm ${(!pagination?.hasNext || productsLoading) ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-300 hover:bg-gray-50'}`}
            >
              다음
            </button>
          </nav>
        </div>
      </div>
      
      {/* 토스트 컴포넌트 */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={1500}
      />
    </div>
  );
} 