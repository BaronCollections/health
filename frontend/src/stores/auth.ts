import { create } from 'zustand';

import {
  getJsonStorageItem,
  getStorageItem,
  removeStorageItem,
  setJsonStorageItem,
  setStorageItem,
} from '@/lib/storage';

export type AuthUser = {
  id: number;
  phone: string;
  nickname: string;
  avatar: string;
};

export const AUTH_TOKEN_STORAGE_KEY = 'mintbit-auth-token';
export const AUTH_USER_STORAGE_KEY = 'mintbit-auth-user';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  logout: () => void;
}

const initialUser = getJsonStorageItem<AuthUser>(AUTH_USER_STORAGE_KEY);
const initialToken = getStorageItem(AUTH_TOKEN_STORAGE_KEY);

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialUser && initialToken),

  setAuth: (user, token) => {
    setStorageItem(AUTH_TOKEN_STORAGE_KEY, token);
    setJsonStorageItem(AUTH_USER_STORAGE_KEY, user);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    removeStorageItem(AUTH_TOKEN_STORAGE_KEY);
    removeStorageItem(AUTH_USER_STORAGE_KEY);
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
