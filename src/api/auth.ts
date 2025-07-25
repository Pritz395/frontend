import api from './axios';
import { LoginCredentials, AuthUser, ApiResponse } from '../types';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<AuthUser>> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return {
        success: true,
        message: response.data.message,
        data: {
          ...response.data.user,
          token: response.data.token,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
        data: null as any,
    };
    }
  },

  getCurrentUser: async (): Promise<ApiResponse<AuthUser>> => {
    try {
      const response = await api.get('/auth/me');
      return {
        success: true,
        message: 'User fetched',
        data: response.data.user,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user',
        data: null as any,
      };
    }
  },
};