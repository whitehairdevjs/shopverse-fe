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

const persistOptions = {
  name: 'auth-storage',
  partialize: (state: AuthState & AuthActions) => ({
    accessToken: state.accessToken,
    member: state.member,
    isAuthenticated: state.isAuthenticated,
  }),
};

export const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    persist<AuthState & AuthActions>(
      (set) => ({
        // State
        accessToken: null,
        member: null,
        isAuthenticated: false,
        isLoading: true,

        setAccessToken: (token: string) => set({ accessToken: token }),
        setMember: (member: Member | null) => set({ member }),
        setAuthenticated: (authenticated: boolean) => set({ isAuthenticated: authenticated }),
        setLoading: (loading: boolean) => set({ isLoading: loading }),
        
        login: (token: string, member: Member) => set({
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
      persistOptions as any
    ),
    { name: 'auth-store', enabled: process.env.NODE_ENV === 'development' } as any
  )
);
