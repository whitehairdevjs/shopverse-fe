// 상품 정보 타입 정의
export type ProductOptions = Record<string, string | number | boolean | null>;

export interface Product {
  id: number;
  variantId?: number;
  name: string;
  slug: string;
  subtitle?: string;
  // JSON 형태로 내려오는 옵션 정보 (예: 색상, 용량 등)
  // 백엔드에서 문자열(JSON 문자열)로 내려올 수도 있어 런타임 호환을 위해 string 허용
  options?: ProductOptions | string | null;
  description?: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number;
  costPrice?: number;
  categoryId: number;
  discountPercent?: number;
  brandId?: number;
  sku?: string;
  barcode?: string;
  weight?: number;
  dimensions?: string;
  status: 'draft' | 'active' | 'inactive' | 'discontinued';
  visibility: 'visible' | 'hidden' | 'catalog_only';
  isDigital?: boolean;
  isSubscription?: boolean;
  isCustomizable?: boolean;
  isPreorder?: boolean;
  preorderDate?: string;
  trackInventory?: boolean;
  allowBackorder?: boolean;
  minOrderQuantity?: number;
  maxOrderQuantity?: number;
  metaTitle?: string;
  metaDescription?: string;
  searchKeywords?: string;
  featuredUntil?: string;
  averageRating?: number;
  reviewCount?: number;
  viewCount?: number;
  salesCount?: number;
  wishlistCount?: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  deletedAt?: string;
}

// 상품 목록 조회 파라미터 타입
export interface ProductListParams {
  categoryId?: number;
  subCategoryId?: number;
  detailCategoryId?: number;
  sort?: 'latest' | 'price-low' | 'price-high' | 'popular' | 'rating';
  page?: number;
  size?: number;
  search?: string;
}

// 상품 목록 응답 타입
export interface ProductListResponse {
  products: Product[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
