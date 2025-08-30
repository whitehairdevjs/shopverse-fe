import { useState, useEffect } from 'react';
import { api } from '../../../../utils/api';

export interface Category {
  id: number;
  code: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: number;
  iconUrl?: string;
  bannerImage?: string;
  sortOrder: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

export interface CategoryHierarchy {
  mainCategories: Category[]; // parent_id가 null인 대분류
  subCategories: Category[];  // 중분류
  detailCategories: Category[]; // 소분류
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryHierarchy, setCategoryHierarchy] = useState<CategoryHierarchy>({
    mainCategories: [],
    subCategories: [],
    detailCategories: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모든 활성화된 카테고리를 가져와서 계층 구조로 분류
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 백엔드의 /product/categories/active 엔드포인트 호출
        const response = await api.product.getActiveCategories();
        
        if (response.success && response.data) {
          const allCategories = response.data as Category[];
          setCategories(allCategories);
          
          // 계층 구조로 분류
          const hierarchy = categorizeByHierarchy(allCategories);
          setCategoryHierarchy(hierarchy);
        } else {
          throw new Error(response.message || '카테고리를 불러오는데 실패했습니다.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
        console.error('카테고리 로딩 오류:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 카테고리를 계층별로 분류하는 함수
  const categorizeByHierarchy = (allCategories: Category[]): CategoryHierarchy => {
    const mainCategories: Category[] = [];
    const subCategories: Category[] = [];
    const detailCategories: Category[] = [];

    allCategories.forEach(category => {
      if (!category.parentId) {
        mainCategories.push(category);
      } else {
        const parent = allCategories.find(c => c.id === category.parentId);
        if (parent && !parent.parentId) {          
          subCategories.push(category);
        } else if (parent && parent.parentId) {          
          detailCategories.push(category);
        }
      }
    });

    // 정렬 순서대로 정렬
    const sortByOrder = (a: Category, b: Category) => a.sortOrder - b.sortOrder;
    
    return {
      mainCategories: mainCategories.sort(sortByOrder),
      subCategories: subCategories.sort(sortByOrder),
      detailCategories: detailCategories.sort(sortByOrder)
    };
  };

  return { 
    categories, 
    categoryHierarchy,
    loading, 
    error
  };
};
