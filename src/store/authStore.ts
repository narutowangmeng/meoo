import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthUser {
  username: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const defaultUser: AuthUser = {
  username: 'admin',
  role: '系统管理员',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
};

const sanitizeAuthState = (state: unknown): Pick<AuthState, 'isAuthenticated' | 'user'> => {
  const candidate = typeof state === 'object' && state !== null ? (state as Partial<AuthState>) : {};
  const userCandidate = candidate.user;

  const user =
    userCandidate &&
    typeof userCandidate.username === 'string' &&
    typeof userCandidate.role === 'string'
      ? {
          username: userCandidate.username,
          role: userCandidate.role,
          avatar: typeof userCandidate.avatar === 'string' ? userCandidate.avatar : defaultUser.avatar,
        }
      : null;

  return {
    isAuthenticated: candidate.isAuthenticated === true && user !== null,
    user,
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: async (username: string, password: string) => {
        if (username === 'admin' && password === 'admin123') {
          set({
            isAuthenticated: true,
            user: defaultUser,
          });
          return true;
        }

        return false;
      },
      logout: () => {
        set({ isAuthenticated: false, user: null });
      },
    }),
    {
      name: 'auth-storage',
      version: 1,
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
      merge: (persistedState, currentState) => {
        const persisted =
          typeof persistedState === 'object' && persistedState !== null && 'state' in persistedState
            ? (persistedState as { state?: unknown }).state
            : persistedState;

        return {
          ...currentState,
          ...sanitizeAuthState(persisted),
        };
      },
    }
  )
);
