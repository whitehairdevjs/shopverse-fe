'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth as useAuthHook, LoginRequest } from './api';

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
  const auth = useAuthHook();
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기 인증 상태 확인
  useEffect(() => {
    if (!auth.isLoading && !isInitialized) {
      setIsInitialized(true);
    }
  }, [auth.isLoading, isInitialized]);

  // 토큰 갱신 함수
  const refreshAuth = async () => {
    // 여기서 토큰 갱신 로직을 실행할 수 있습니다
    // 현재는 useAuth 훅에서 자동으로 처리되므로 빈 함수로 둡니다
  };

  const value: AuthContextType = {
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading || !isInitialized,
    user: auth.user,
    login: auth.login,
    logout: auth.logout,
    refreshAuth,
    loadUserInfo: auth.loadUserInfo,
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
