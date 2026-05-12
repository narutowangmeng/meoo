import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
    role: string;
    avatar?: string;
  } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (username: string, password: string) => {
        if (username === 'admin' && password === 'admin123') {
          set({
            isAuthenticated: true,
            user: {
              username: 'admin',
              role: '系统管理员',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
            }
          });
          return true;
        }
        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);
