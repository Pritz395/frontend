import api from './axios';
import { ActivityLog, ApiResponse, PaginatedResponse } from '../types';

export const logsApi = {
  getLogs: async (
    page = 1,
    limit = 10,
    filters?: { userId?: string; type?: string; dateFrom?: string; dateTo?: string; application?: string }
  ): Promise<ApiResponse<PaginatedResponse<ActivityLog>>> => {
    try {
      const params: any = { page, limit, ...filters };
      const response = await api.get('/logs', { params });
    return {
      success: true,
      message: 'Logs fetched successfully',
      data: {
          data: response.data.logs,
          total: response.data.total,
          page: response.data.page,
          limit: response.data.limit,
          totalPages: response.data.totalPages,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch logs',
        data: null as any,
      };
    }
  },

  getSummary: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await api.get('/logs/summary');
      return {
        success: true,
        message: 'Summary fetched successfully',
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch summary',
        data: null as any,
    };
  }
  },
};