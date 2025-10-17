'use client';

import { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import type { Product, ProductListParams } from '../types';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useProducts = (params: ProductListParams = {}): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      // 카테고리 ID가 있으면 카테고리별 상품 조회
      if (params.categoryId) {
        response = await api.product.getByCategoryId(params.categoryId);
      } else {
        // 전체 상품 조회 (나중에 구현)
        response = await api.product.getList(params);
      }

      if (response.success && response.data) {
        setProducts(response.data as Product[]);
      } else {
        setError(response.error || '상품을 불러오는데 실패했습니다.');
        setProducts([]);
      }
    } catch (err) {
      setError('상품을 불러오는 중 오류가 발생했습니다.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [params.categoryId, params.subCategoryId, params.detailCategoryId, params.sort]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
  };
};
