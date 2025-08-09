import { API_BASE_URL, API_ENDPOINTS, HTTP_METHODS, DEFAULT_HEADERS } from '../constants';
import { useState, useEffect } from 'react';

// API 응답 타입
export interface ApiResponse<T = any> {
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
  body?: any;
  timeout?: number;
  credentials?: RequestCredentials;
  skipAuthRefresh?: boolean; // 토큰 갱신을 건너뛸지 여부
}

// 토큰 갱신 상태 관리
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
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

// 공통 토큰 관리 함수들
const tokenUtils = {
  // 모든 토큰 삭제
  clearAllTokens: () => {
    cookieUtils.deleteCookie('accessToken');
    cookieUtils.deleteCookie('refreshToken');
  },

  // 토큰 갱신 시도
  tryRefreshToken: async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/member/reissue-access-token`, {
        method: 'POST',
        credentials: 'include',
        headers: DEFAULT_HEADERS,
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.success;
      }
      return false;
    } catch (error) {
      return false;
    }
  },

  // 로그아웃 처리 (공통)
  handleLogout: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/member/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      // 서버 로그아웃 요청 실패 처리
    } finally {
      tokenUtils.clearAllTokens();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
  }
};

// 기본 API 클라이언트
class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = { ...DEFAULT_HEADERS, ...defaultHeaders };
  }

  // URL 생성
  private buildUrl(endpoint: string): string {
    return `${this.baseURL}${endpoint}`;
  }

  // 헤더 생성
  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    return { ...this.defaultHeaders, ...customHeaders };
  }

  // 토큰 갱신 함수
  private async refreshAccessToken(): Promise<string | null> {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }

    isRefreshing = true;

    try {
      const response = await fetch(this.buildUrl('/member/reissue-access-token'), {
        method: 'POST',
        credentials: 'include',
        headers: this.defaultHeaders,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          processQueue(null, data.data?.accessToken);
          return data.data?.accessToken;
        }
      }
      
      // 갱신 실패 시 로그아웃 처리
      await tokenUtils.handleLogout();
      processQueue(new Error('토큰 갱신 실패'));
      return null;
    } catch (error) {
      await tokenUtils.handleLogout();
      processQueue(error);
      return null;
    } finally {
      isRefreshing = false;
    }
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
    const requestHeaders = this.buildHeaders(headers);

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
        const newToken = await this.refreshAccessToken();
        if (newToken) {
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
  async post<T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  // PUT 요청
  async put<T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  // DELETE 요청
  async delete<T>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  // PATCH 요청
  async patch<T>(endpoint: string, body?: any, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }
}

// API 클라이언트 인스턴스 생성
export const apiClient = new ApiClient(API_BASE_URL);

// 편의 함수들
export const api = {
  // Member API
  member: {
    signup: (data: any) => apiClient.post(API_ENDPOINTS.MEMBER.SIGNUP, data),
    login: (data: any) => apiClient.post(API_ENDPOINTS.MEMBER.LOGIN, data),
    logout: () => apiClient.post(API_ENDPOINTS.MEMBER.LOGOUT, null, { skipAuthRefresh: true }),
    getProfile: () => apiClient.get(API_ENDPOINTS.MEMBER.PROFILE),
    validateToken: () => apiClient.get(API_ENDPOINTS.MEMBER.VALIDATE_TOKEN),
    updateProfile: (data: any) => apiClient.put(API_ENDPOINTS.MEMBER.UPDATE_PROFILE, data),
    forgotPassword: (data: any) => apiClient.post(API_ENDPOINTS.MEMBER.FORGOT_PASSWORD, data),
    resetPassword: (data: any) => apiClient.post(API_ENDPOINTS.MEMBER.RESET_PASSWORD, data),
    checkLoginId: (loginId: string) => apiClient.get(`${API_ENDPOINTS.MEMBER.CHECK_LOGIN_ID}?loginId=${encodeURIComponent(loginId)}`),
    checkEmail: (email: string) => apiClient.get(`${API_ENDPOINTS.MEMBER.CHECK_EMAIL}?email=${encodeURIComponent(email)}`),
    refreshToken: () => apiClient.post('/member/reissue-access-token', null, { skipAuthRefresh: true }),
  },

  // Product API
  product: {
    getList: (params?: any) => apiClient.get(API_ENDPOINTS.PRODUCT.LIST, { body: params }),
    getDetail: (id: string | number) => apiClient.get(API_ENDPOINTS.PRODUCT.DETAIL.replace(':id', String(id))),
    search: (params: any) => apiClient.get(API_ENDPOINTS.PRODUCT.SEARCH, { body: params }),
  },

  // Cart API
  cart: {
    getList: () => apiClient.get(API_ENDPOINTS.CART.LIST),
    add: (data: any) => apiClient.post(API_ENDPOINTS.CART.ADD, data),
    update: (data: any) => apiClient.put(API_ENDPOINTS.CART.UPDATE, data),
    remove: (id: string | number) => apiClient.delete(API_ENDPOINTS.CART.REMOVE, { body: { id } }),
    clear: () => apiClient.delete(API_ENDPOINTS.CART.CLEAR),
  },

  // Order API
  order: {
    create: (data: any) => apiClient.post(API_ENDPOINTS.ORDER.CREATE, data),
    getList: () => apiClient.get(API_ENDPOINTS.ORDER.LIST),
    getDetail: (id: string | number) => apiClient.get(API_ENDPOINTS.ORDER.DETAIL.replace(':id', String(id))),
    cancel: (id: string | number) => apiClient.post(API_ENDPOINTS.ORDER.CANCEL.replace(':id', String(id))),
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
  user?: {
    id: number;
    loginId: string;
    email: string;
    name: string;
    role: string;
  };
}

// 인증 관련 유틸리티 함수들
export const authUtils = {
  // 로그인 상태 확인 (간단한 방법)
  isAuthenticated: async (): Promise<boolean> => {
    try {
      // 프로필 정보를 가져와서 인증 상태 확인
      const response = await fetch(`${API_BASE_URL}/member/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: DEFAULT_HEADERS,
      });
      
      return response.ok;
    } catch (error) {
      // Profile check error: error
      return false;
    }
  },

  // refreshToken 존재 확인
  hasRefreshToken: async (): Promise<boolean> => {
    try {
      // 토큰 갱신 요청을 보내서 refreshToken 존재 여부 확인
      const response = await fetch(`${API_BASE_URL}/member/reissue-access-token`, {
        method: 'POST',
        credentials: 'include',
        headers: DEFAULT_HEADERS,
      });
      
      return response.ok;
    } catch (error) {
      return false;
    }
  },

  // 토큰 갱신 시도
  tryRefreshToken: tokenUtils.tryRefreshToken,

  // 로그아웃 처리
  logout: tokenUtils.handleLogout,

  // 토큰 갱신 함수 (별칭)
  refreshToken: tokenUtils.tryRefreshToken
};

// 인증 상태를 관리하는 React 훅
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<any>(null);

  // 서버에서 인증 상태 확인
  const checkAuthStatus = async () => {
    try {
      
      // 1. 프로필 API로 accessToken 유효성 확인 (토큰 갱신 건너뛰기)
      const profileResponse = await apiClient.get(API_ENDPOINTS.MEMBER.PROFILE, { 
        skipAuthRefresh: true 
      });
      
      
      if (profileResponse.success && profileResponse.data) {
        // accessToken이 유효함
        setIsAuthenticated(true);
        setUser(profileResponse.data);
        return;
      }
      
      // 2. accessToken이 유효하지 않으면 토큰 갱신 시도
      const refreshResponse = await api.member.refreshToken();
      
      
      if (refreshResponse.success) {
        // 토큰 갱신 성공, 다시 프로필 조회
        const retryProfileResponse = await apiClient.get(API_ENDPOINTS.MEMBER.PROFILE, { 
          skipAuthRefresh: true 
        });
        
        
        if (retryProfileResponse.success && retryProfileResponse.data) {
          setIsAuthenticated(true);
          setUser(retryProfileResponse.data);
          return;
        } else {
          // 토큰 갱신은 성공했지만 프로필 조회 실패
          // 서버 오류인 경우에도 토큰이 갱신되었으므로 인증된 상태로 설정
          if (retryProfileResponse.status === 500) {
            setIsAuthenticated(true);
            setUser(null); // 사용자 정보는 없지만 인증 상태는 유지
            return;
          }
        }
      }
      
      // 3. 모든 시도 실패
      setIsAuthenticated(false);
      setUser(null);
      
    } catch (error) {
      // Auth check error: error
      // Error details: { name: error instanceof Error ? error.name : 'Unknown', message: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : 'No stack trace' }
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 로그인 함수
  const login = async (loginData: LoginRequest) => {
    try {
      const response = await api.member.login(loginData);
      
      if (response.success) {
        // 로그인 성공 시 인증 상태 업데이트
        setIsAuthenticated(true);
        setUser((response.data as any)?.user || null);
        
        // 페이지 새로고침으로 상태 동기화
        window.location.href = '/home';
      }
      
      return response;
    } catch (error) {
      // Login error: error
      return { success: false, error: '로그인 중 오류가 발생했습니다.' };
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      // 서버에 로그아웃 요청
      await api.member.logout();
    } catch (error) {
      // Logout error: error
    } finally {
      // 클라이언트 상태 초기화
      setIsAuthenticated(false);
      setUser(null);
      
      // 로그인 페이지로 이동
      window.location.href = '/login';
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
  };
}; 