import axios from 'axios';

import {
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from '@/stores/auth';
import { getStorageItem, removeStorageItem } from './storage';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token
api.interceptors.request.use((config) => {
  const token = getStorageItem(AUTH_TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      removeStorageItem(AUTH_TOKEN_STORAGE_KEY);
      removeStorageItem(AUTH_USER_STORAGE_KEY);
    }
    return Promise.reject(error);
  }
);

export default api;
