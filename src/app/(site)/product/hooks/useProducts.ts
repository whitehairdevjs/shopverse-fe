'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/utils/api';
import type { Product, ProductListParams, ProductListResponse } from '../types';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  refetch: () => void;
}

export const useProducts = (params: ProductListParams = {}): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<UseProductsResult['pagination']>({
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 가장 구체적인 선택(소분류 > 중분류 > 대분류)을 우선하여 categoryId 적용
      const selectedCategoryId = (params.detailCategoryId ?? params.subCategoryId ?? params.categoryId);

      const queryParams: Record<string, string | number | boolean | undefined> = {
        categoryId: selectedCategoryId,
        sort: params.sort,
        page: params.page,
        size: params.size,
        search: params.search,
      };

      const response = await api.product.getList(queryParams);

      if (response.success && response.data) {
        const data = response.data as unknown as ProductListResponse;
        setProducts(data.products ?? []);
        setPagination({
          totalCount: data.totalCount ?? 0,
          currentPage: data.currentPage ?? (params.page || 1),
          totalPages: data.totalPages ?? 1,
          hasNext: data.hasNext ?? false,
          hasPrevious: data.hasPrevious ?? false,
        });
      } else {
        setError(response.error || '상품을 불러오는데 실패했습니다.');
        setProducts([]);
        setPagination({ totalCount: 0, currentPage: params.page || 1, totalPages: 1, hasNext: false, hasPrevious: false });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '상품을 불러오는 중 오류가 발생했습니다.';
      setError(errorMessage);
      setProducts([]);
      setPagination({ totalCount: 0, currentPage: params.page || 1, totalPages: 1, hasNext: false, hasPrevious: false });
    } finally {
      setLoading(false);
    }
  }, [params.categoryId, params.subCategoryId, params.detailCategoryId, params.sort, params.page, params.size, params.search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    pagination,
    refetch: fetchProducts,
  };
};
