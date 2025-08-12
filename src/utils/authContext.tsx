'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { LoginRequest, api, authUtils } from './api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  member: any;
  login: (loginData: LoginRequest) => Promise<any>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  loadUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    isAuthenticated,
    isLoading,
    member,
    login,
    setLoading,
  } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentState = useAuthStore.getState();
      
      // 1. 로그아웃된 사용자 (isAuthenticated: false, accessToken: null)
      if (!currentState.isAuthenticated && !currentState.accessToken) {
        return;
      } else {        
        const profileResponse = await api.member.getProfile({ 
          skipAuthRefresh: true 
        });
        
        if (!profileResponse.success) {
          // 프로필 조회 실패 → 토큰 재발급 시도
        const refreshResponse = await authUtils.tryReissueAccessToken();
          
          if (refreshResponse) {
            // 토큰 재발급 성공 → 다시 프로필 조회
            const retryProfileResponse = await api.member.getProfile({ 
              skipAuthRefresh: true 
            });
            
            if (retryProfileResponse.success && retryProfileResponse.data) {
              useAuthStore.getState().setAuthenticated(true);
              useAuthStore.getState().setMember(retryProfileResponse.data as any);
              return;
            } else if (retryProfileResponse.status === 500) {
              // 서버 에러 시에도 인증된 상태로 간주 (토큰은 유효하지만 프로필 조회 실패)
              useAuthStore.getState().setAuthenticated(true);
              useAuthStore.getState().setMember(null);
              return;
            }
          }
          
          // 토큰 재발급 실패 → 로그아웃 처리
          useAuthStore.getState().setAuthenticated(false);
          useAuthStore.getState().setMember(null);
          return;  
        }    
      }
      
    } catch (error) {
      // 에러 발생 시 → 로그아웃 처리
      useAuthStore.getState().setAuthenticated(false);
      useAuthStore.getState().setMember(null);
    } finally {
      useAuthStore.getState().setLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    member,
    login: async (loginData: LoginRequest) => {
      try {
        const response = await api.member.login(loginData);
        
        if (response.success) {
          const memberData = (response.data as any)?.member;
          const accessToken = (response.data as any)?.accessToken;

          if (memberData && accessToken) {
            useAuthStore.getState().login(accessToken, memberData);
            
            if (typeof window !== 'undefined') {
              window.location.href = '/home';
            }
          }
        }
        
        return response;
      } catch (error) {
        console.error('로그인 에러:', error);
        return { success: false, error: '로그인 중 오류가 발생했습니다.' };
      }
    },
    logout: async () => {
      try {
        await authUtils.logout();
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
    refreshAuth: async () => {
      try {
        const response = await api.member.reissueAccessToken();

        if (response.success) {
          try {
            const profileResponse = await api.member.getProfile();
            if (profileResponse.success && profileResponse.data) {
              useAuthStore.getState().setMember(profileResponse.data as any);
              useAuthStore.getState().setAuthenticated(true);
            }
          } catch (profileError) {
            console.error('Profile load error:', profileError);
          }
        }
      } catch (error) {
        console.error('Refresh auth error:', error);
      }
    },
    loadUserInfo: async () => {
      try {
        const response = await api.member.getProfile();
        
        if (response.success && response.data) {
          useAuthStore.getState().setMember(response.data as any);
          useAuthStore.getState().setAuthenticated(true);
        }
      } catch (error) {
        console.error('Load user info error:', error);
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
