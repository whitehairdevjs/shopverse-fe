import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface User {
  id: number;
  loginId: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAccessToken: (token: string) => void;
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        // State
        accessToken: null,
        user: null,
        isAuthenticated: false,
        isLoading: false, // 초기값을 false로 설정

        // Actions
        setAccessToken: (token) => set({ accessToken: token }),
        setUser: (user) => set({ user }),
        setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
        setLoading: (loading) => set({ isLoading: loading }),
        
        login: (token, user) => set({
          accessToken: token,
          user,
          isAuthenticated: true,
          isLoading: false,
        }),
        
        logout: () => set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
        
        clearAuth: () => set({
          accessToken: null,
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          accessToken: state.accessToken,
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store', // Redux DevTools에서 보일 이름
    }
  )
);
