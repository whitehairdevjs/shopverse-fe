// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081';

// API Endpoints
export const API_ENDPOINTS = {
  // Member related endpoints
  MEMBER: {
    SIGNUP: '/member/signup',
    LOGIN: '/member/login',
    LOGOUT: '/member/logout',
    PROFILE: '/member/profile',
    VALIDATE_TOKEN: '/member/validate-token', // 토큰 검증 전용
    UPDATE_PROFILE: '/member/profile/update',
    FORGOT_PASSWORD: '/member/forgot-password',
    RESET_PASSWORD: '/member/reset-password',
    CHECK_LOGIN_ID: '/member/check-login-id',
    CHECK_EMAIL: '/member/check-email',
  },
  
  // Product related endpoints
  PRODUCT: {
    LIST: '/products',
    DETAIL: '/products/:id',
    SEARCH: '/products/search',
  },
  
  // Cart related endpoints
  CART: {
    LIST: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear',
  },
  
  // Order related endpoints
  ORDER: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: '/orders/:id',
    CANCEL: '/orders/:id/cancel',
  },
} as const;

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

// Common HTTP Headers
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
} as const;

// 페이지네이션 상수
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// 상품 관련 상수
export const PRODUCT_CATEGORIES = [
  { id: 'electronics', name: '전자제품', icon: '📱' },
  { id: 'fashion', name: '패션', icon: '👕' },
  { id: 'home', name: '홈&리빙', icon: '🏠' },
  { id: 'sports', name: '스포츠', icon: '⚽' },
  { id: 'beauty', name: '뷰티', icon: '💄' },
  { id: 'books', name: '도서', icon: '📚' }
] as const;

export const PRODUCT_SORT_OPTIONS = [
  { value: 'latest', label: '최신순' },
  { value: 'price_asc', label: '가격낮은순' },
  { value: 'price_desc', label: '가격높은순' },
  { value: 'rating', label: '평점순' },
  { value: 'sales', label: '판매순' }
] as const;

// 주문 상태 상수
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: '주문대기',
  [ORDER_STATUS.CONFIRMED]: '주문확정',
  [ORDER_STATUS.SHIPPING]: '배송중',
  [ORDER_STATUS.DELIVERED]: '배송완료',
  [ORDER_STATUS.CANCELLED]: '주문취소'
} as const;

// 결제 방법 상수
export const PAYMENT_METHODS = [
  { value: 'card', label: '신용카드' },
  { value: 'transfer', label: '계좌이체' },
  { value: 'deposit', label: '무통장입금' },
  { value: 'phone', label: '휴대폰 결제' }
] as const;

// 배송 관련 상수
export const SHIPPING_FEE = 3000;
export const FREE_SHIPPING_THRESHOLD = 50000;

// 라이브 관련 상수
export const LIVE_STATUS = {
  UPCOMING: 'upcoming',
  LIVE: 'live',
  ENDED: 'ended'
} as const;

// 에러 메시지 상수
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
  SERVER_ERROR: '서버 오류가 발생했습니다.',
  NOT_FOUND: '요청한 정보를 찾을 수 없습니다.',
  UNAUTHORIZED: '로그인이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  VALIDATION_ERROR: '입력 정보를 확인해주세요.'
} as const;

// 성공 메시지 상수
export const SUCCESS_MESSAGES = {
  PRODUCT_ADDED_TO_CART: '상품이 장바구니에 추가되었습니다.',
  ORDER_COMPLETED: '주문이 완료되었습니다.',
  PROFILE_UPDATED: '프로필이 업데이트되었습니다.',
  PASSWORD_CHANGED: '비밀번호가 변경되었습니다.'
} as const;

// 로컬 스토리지 키 상수
export const STORAGE_KEYS = {
  CART_ITEMS: 'cart_items',
  USER_TOKEN: 'user_token',
  USER_PROFILE: 'user_profile',
  THEME: 'theme'
} as const;

// 테마 상수
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
} as const; 