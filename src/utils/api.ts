import { API_BASE_URL, API_ENDPOINTS, HTTP_METHODS, DEFAULT_HEADERS } from '../constants';

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
}

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

  // API 요청 실행
  private async request<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = 10000,
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
      });

      clearTimeout(timeoutId);

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
        data: responseData,
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
    logout: () => apiClient.post(API_ENDPOINTS.MEMBER.LOGOUT),
    getProfile: () => apiClient.get(API_ENDPOINTS.MEMBER.PROFILE),
    updateProfile: (data: any) => apiClient.put(API_ENDPOINTS.MEMBER.UPDATE_PROFILE, data),
    forgotPassword: (data: any) => apiClient.post(API_ENDPOINTS.MEMBER.FORGOT_PASSWORD, data),
    resetPassword: (data: any) => apiClient.post(API_ENDPOINTS.MEMBER.RESET_PASSWORD, data),
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