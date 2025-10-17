import { API_BASE_URL, API_ENDPOINTS, HTTP_METHODS, DEFAULT_HEADERS } from '../constants';
import { useAuthStore } from '../stores/authStore';
import type { Member } from '../stores/authStore';

// API 응답 타입
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp?: string;
  status?: number;
  error?: string;
  details?: { [key: string]: string };
}

// API 요청 옵션 타입
export interface ApiRequestOptions {
  method?: keyof typeof HTTP_METHODS;
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
  credentials?: RequestCredentials;
  skipAuthRefresh?: boolean; // 토큰 갱신을 건너뛸지 여부
}

// 토큰 갱신 상태 관리
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: boolean) => void;
  reject: (error: Error) => void;
}> = [];

const processQueue = (error: Error | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(true);
    }
  });
  
  failedQueue = [];
};

// 쿠키 관련 유틸리티 함수들
export const cookieUtils = {
  // 쿠키 설정 (클라이언트 사이드에서 사용)
  setCookie: (name: string, value: string, options: {
    expires?: Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
  } = {}) => {
    let cookieString = `${name}=${encodeURIComponent(value)}`;
    
    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }
    if (options.path) {
      cookieString += `; path=${options.path}`;
    }
    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }
    if (options.secure) {
      cookieString += '; secure';
    }
    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }
    
    document.cookie = cookieString;
  },

  // 쿠키 가져오기
  getCookie: (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop()?.split(';').shift() || '');
    }
    return null;
  },

  // 쿠키 삭제
  deleteCookie: (name: string, options: {
    path?: string;
    domain?: string;
  } = {}) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT${options.path ? `; path=${options.path}` : ''}${options.domain ? `; domain=${options.domain}` : ''}`;
  },

  // 모든 쿠키 가져오기
  getAllCookies: (): Record<string, string> => {
    const cookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = decodeURIComponent(value);
      }
    });
    return cookies;
  },

  // 특정 쿠키가 존재하는지 확인
  hasCookie: (name: string): boolean => {
    const cookie = cookieUtils.getCookie(name);
    return cookie !== null;
  },
};

const tokenUtils = {
  clearAllTokens: () => {
    useAuthStore.getState().clearAuth();
  },

  // 액세스 토큰 재발급 시도
  tryReissueAccessToken: async (): Promise<boolean> => {
    try {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }
  
      isRefreshing = true;

      const response = await api.member.reissueAccessToken();

      if (response.success) {
        const data = await (response.data as { accessToken: string });        
        const newToken = data.accessToken;
        if (newToken) {
                      // Zustand store에 새로운 access token 저장
            useAuthStore.getState().setAccessToken(newToken);
            processQueue(null);
            return response.success;
        }        
      }      
    
      await tokenUtils.handleLogout();
      processQueue(new Error('토큰 갱신 실패'));
      return false;      
    } catch (error) {
      await tokenUtils.handleLogout();
      processQueue(error as Error);
      return false;
    } finally {
      isRefreshing = false;
    }
  },

  handleLogout: async (): Promise<void> => {
    try {
      await api.member.logout();
    } catch {
      // 서버 로그아웃 요청 실패 처리
    } finally {
      tokenUtils.clearAllTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/home';
      }
    }
  }
};

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = { ...DEFAULT_HEADERS, ...defaultHeaders };
  }

  private buildUrl(endpoint: string): string {
    return `${this.baseURL}${endpoint}`;
  }

  private buildHeaders(customHeaders?: Record<string, string>, skipAuth = false): Record<string, string> {
    const headers = { ...this.defaultHeaders, ...customHeaders };

    if (!skipAuth) {
      const accessToken = useAuthStore.getState().accessToken;
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }
    
    return headers;
  }

  // API 요청 실행 (토큰 갱신 로직 포함)
  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = 10000,
      credentials = 'include',
      skipAuthRefresh = false,
    } = options;

    const url = this.buildUrl(endpoint);
    const requestHeaders = this.buildHeaders(headers, skipAuthRefresh);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: HTTP_METHODS[method],
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
        credentials,
      });

      clearTimeout(timeoutId);

      // 401 에러이고 토큰 갱신을 건너뛰지 않는 경우
      if (response.status === 401 && !skipAuthRefresh) {
        const response = await tokenUtils.tryReissueAccessToken();
        if (response) {
          // 토큰 갱신 성공 시 원래 요청 재시도
          return this.request<T>(endpoint, options);
        }
      }

      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: responseData.error || `HTTP ${response.status}: ${response.statusText}`,
          message: responseData.message,
          timestamp: responseData.timestamp,
          status: responseData.status,
          details: responseData.details,
        };
      }

      return {
        success: true,
        data: responseData.data,
        message: responseData.message,
        timestamp: responseData.timestamp,
        status: responseData.status,
        error: responseData.error,
        details: responseData.details,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: '요청 시간이 초과되었습니다.',
          };
        }
        return {
          success: false,
          error: error.message || '알 수 없는 오류가 발생했습니다.',
        };
      }

      return {
        success: false,
        error: '알 수 없는 오류가 발생했습니다.',
      };
    }
  }

  // GET 요청
  async get<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  // POST 요청
  async post<T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  // PUT 요청
  async put<T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  // DELETE 요청
  async delete<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // PATCH 요청
  async patch<T>(endpoint: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }
}

// API 클라이언트 인스턴스 생성
export const apiClient = new ApiClient(API_BASE_URL);

// 편의 함수들
export const api = {
  // Member API
  member: {
    signup: (data: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
      apiClient.post(API_ENDPOINTS.MEMBER.SIGNUP, data, options),
    login: (data: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
      apiClient.post(API_ENDPOINTS.MEMBER.LOGIN, data, options),
    logout: (options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.post(API_ENDPOINTS.MEMBER.LOGOUT, null, { skipAuthRefresh: true, ...options }),
    getProfile: (options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.get(API_ENDPOINTS.MEMBER.PROFILE, options),
    validateToken: (options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.get(API_ENDPOINTS.MEMBER.VALIDATE_TOKEN, options),
    updateProfile: (data: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
      apiClient.put(API_ENDPOINTS.MEMBER.UPDATE_PROFILE, data, options),
    forgotPassword: (data: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
      apiClient.post(API_ENDPOINTS.MEMBER.FORGOT_PASSWORD, data, options),
    resetPassword: (data: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
      apiClient.post(API_ENDPOINTS.MEMBER.RESET_PASSWORD, data, options),
    checkLoginId: (loginId: string, options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.get(`${API_ENDPOINTS.MEMBER.CHECK_LOGIN_ID}?loginId=${encodeURIComponent(loginId)}`, options),
    checkEmail: (email: string, options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.get(`${API_ENDPOINTS.MEMBER.CHECK_EMAIL}?email=${encodeURIComponent(email)}`, options),
    reissueAccessToken: (options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
      apiClient.post('/member/reissue-access-token', null, { skipAuthRefresh: true, ...options }),
  },

  // Product API
  product: {
    getList: (
      params?: Record<string, string | number | boolean | undefined>,
      options?: Omit<ApiRequestOptions, 'method'>
    ) => {
      const entries = Object.entries(params ?? {}).filter(([_, v]) => v !== undefined && v !== '' && v !== null);
      const query = entries
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
        .join('&');
      const endpoint = query ? `${API_ENDPOINTS.PRODUCT.LIST}?${query}` : API_ENDPOINTS.PRODUCT.LIST;
      return apiClient.get(endpoint, options);
    },
    getDetail: (id: string | number, options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.get(API_ENDPOINTS.PRODUCT.DETAIL.replace(':id', String(id)), options),
    search: (params: unknown, options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.get(API_ENDPOINTS.PRODUCT.SEARCH, { body: params, ...options }),
    getByCategoryId: (categoryId: string | number, options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.get(API_ENDPOINTS.PRODUCT.LIST_BY_CATEGORY.replace(':categoryId', String(categoryId)), options),
    // Category API
    getCategories: (options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.get(API_ENDPOINTS.PRODUCT.CATEGORIES, options),
    getActiveCategories: (options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.get(API_ENDPOINTS.PRODUCT.CATEGORIES_ACTIVE, options),
  },

  // Cart API
  cart: {
    getList: (options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.get(API_ENDPOINTS.CART.LIST, options),
    add: (data: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
      apiClient.post(API_ENDPOINTS.CART.ADD, data, options),
    update: (data: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
      apiClient.put(API_ENDPOINTS.CART.UPDATE, data, options),
    remove: (id: string | number, options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.delete(API_ENDPOINTS.CART.REMOVE, { body: { id }, ...options }),
    clear: (options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.delete(API_ENDPOINTS.CART.CLEAR, options),
  },

  // Order API
  order: {
    create: (data: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) => 
      apiClient.post(API_ENDPOINTS.ORDER.CREATE, data, options),
    getList: (options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.get(API_ENDPOINTS.ORDER.LIST, options),
    getDetail: (id: string | number, options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.get(API_ENDPOINTS.ORDER.DETAIL.replace(':id', String(id)), options),
    cancel: (id: string | number, options?: Omit<ApiRequestOptions, 'method'>) => 
      apiClient.post(API_ENDPOINTS.ORDER.CANCEL.replace(':id', String(id)), options),
  },
};

// 로그인 요청 타입
export interface LoginRequest {
  loginId: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  success: boolean;
  message?: string;
  member?: Member;
}

// 인증 관련 유틸리티 함수들
export const authUtils = {
  // 로그인 상태 확인 (Zustand store 사용)
  isAuthenticated: (): boolean => {
    return useAuthStore.getState().isAuthenticated;
  },

  // refreshToken 존재 확인
  hasRefreshToken: async (): Promise<boolean> => {
    try {
      // 액세스 토큰 재발급 요청을 보내서 refreshToken 존재 여부 확인
      const response = await api.member.reissueAccessToken();
      return response.success;
    } catch {
      return false;
    }
  },

  // 액세스 토큰 재발급 시도
  tryReissueAccessToken: tokenUtils.tryReissueAccessToken,

  // 로그아웃 처리
  logout: tokenUtils.handleLogout
};

 