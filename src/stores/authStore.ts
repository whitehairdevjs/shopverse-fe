import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface Member {
  loginId: string;
  name: string;
}

interface AuthState {
  accessToken: string | null;
  member: Member | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setAccessToken: (token: string) => void;
  setMember: (member: Member | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  login: (token: string, member: Member) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist(
      (set) => ({
        // State
        accessToken: null,
        member: null,
        isAuthenticated: false,
        isLoading: false, // 초기값을 false로 설정

        // Actions
        setAccessToken: (token) => set({ accessToken: token }),
        setMember: (member) => set({ member }),
        setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
        setLoading: (loading) => set({ isLoading: loading }),
        
        login: (token, member) => set({
          accessToken: token,
          member,
          isAuthenticated: true,
          isLoading: false,
        }),
        

        
        clearAuth: () => set({
          accessToken: null,
          member: null,
          isAuthenticated: false,
          isLoading: false,
        }),
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          accessToken: state.accessToken,
          member: state.member,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store', // Redux DevTools에서 보일 이름
    }
  )
);
