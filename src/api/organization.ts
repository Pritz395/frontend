import api from './axios';
import { Organization, ApiResponse } from '../types';

export const organizationApi = {
  getOrganization: async (): Promise<ApiResponse<Organization>> => {
    try {
      const response = await api.get('/orgs/me'); // Adjust endpoint as needed
    return {
      success: true,
      message: 'Organization data fetched successfully',
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch organization',
        data: null as any,
    };
    }
  },

  updateOrganization: async (data: Partial<Organization>): Promise<ApiResponse<Organization>> => {
    try {
      const response = await api.put('/orgs/me', data); // Adjust endpoint as needed
    return {
      success: true,
      message: 'Organization updated successfully',
        data: response.data.data,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update organization',
        data: null as any,
    };
  }
  },
};