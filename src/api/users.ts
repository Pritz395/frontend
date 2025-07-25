import api from './axios';
import { User, ApiResponse, PaginatedResponse } from '../types';

export const usersApi = {
  getUsers: async (page = 1, limit = 10): Promise<ApiResponse<PaginatedResponse<User>>> => {
    try {
      const response = await api.get('/users', { params: { page, limit } });
    return {
      success: true,
      message: 'Users fetched successfully',
      data: {
          data: response.data,
          total: response.data.length,
        page,
        limit,
          totalPages: 1, // Adjust if backend supports pagination
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch users',
        data: null as any,
      };
    }
  },

  updateUserRole: async (userId: string, role: string): Promise<ApiResponse<User>> => {
    try {
      const response = await api.patch(`/users/${userId}/role`, { role });
      return {
        success: true,
        message: 'User role updated successfully',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update user role',
        data: null as any,
      };
    }
  },

  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      await api.delete(`/users/${userId}`);
      return {
        success: true,
        message: 'User deleted successfully',
        data: undefined as any,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete user',
        data: undefined as any,
    };
  }
  },
};