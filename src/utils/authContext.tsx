'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { LoginRequest, api } from './api';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
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
    user,
    login,
    logout,
    setLoading,
  } = useAuthStore();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const profileResponse = await api.member.getProfile({ 
        skipAuthRefresh: true 
      });
      
      if (profileResponse.success && profileResponse.data) {
        useAuthStore.getState().setAuthenticated(true);
        useAuthStore.getState().setUser(profileResponse.data as any);
        return;
      }
      
      const refreshResponse = await api.member.refreshToken();
      
      if (refreshResponse.success) {
        const retryProfileResponse = await api.member.getProfile({ 
          skipAuthRefresh: true 
        });
        
        if (retryProfileResponse.success && retryProfileResponse.data) {
          useAuthStore.getState().setAuthenticated(true);
          useAuthStore.getState().setUser(retryProfileResponse.data as any);
          return;
        } else {
          if (retryProfileResponse.status === 500) {
            useAuthStore.getState().setAuthenticated(true);
            useAuthStore.getState().setUser(null);
            return;
          }
        }
      }
      
      useAuthStore.getState().setAuthenticated(false);
      useAuthStore.getState().setUser(null);
      
    } catch (error) {
      useAuthStore.getState().setAuthenticated(false);
      useAuthStore.getState().setUser(null);
    } finally {
      useAuthStore.getState().setLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    login: async (loginData: LoginRequest) => {
      try {
        const response = await api.member.login(loginData);
        
        if (response.success) {
          const userData = (response.data as any)?.user;
          const accessToken = (response.data as any)?.accessToken;
          
          if (userData && accessToken) {
            useAuthStore.getState().login(accessToken, userData);
          } else {
            console.log('userData 또는 accessToken이 없음');
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
        await api.member.logout();
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        useAuthStore.getState().logout();
      }
    },
    refreshAuth: async () => {
      try {
        const response = await api.member.refreshToken();
        
        if (response.success) {
          try {
            const profileResponse = await api.member.getProfile();
            if (profileResponse.success && profileResponse.data) {
              useAuthStore.getState().setUser(profileResponse.data as any);
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
          useAuthStore.getState().setUser(response.data as any);
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
