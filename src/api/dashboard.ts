import api from './axios';
import { DashboardStats, ApiResponse, ChartData } from '../types';

export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'Stats fetched successfully',
      data: {
        totalUsers: 156,
        activeUsers: 89,
        logsToday: 2847,
        averageScreenTime: 28800, // 8 hours in seconds
        trends: {
          users: 12.5,
          activity: -3.2,
          screenTime: 5.8
        }
      }
    };
  },

  getActivityChart: async (): Promise<ApiResponse<ChartData[]>> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: 'Activity chart data fetched successfully',
      data: [
        { name: 'Mon', value: 120 },
        { name: 'Tue', value: 135 },
        { name: 'Wed', value: 98 },
        { name: 'Thu', value: 167 },
        { name: 'Fri', value: 145 },
        { name: 'Sat', value: 78 },
        { name: 'Sun', value: 56 }
      ]
    };
  },

  getApplicationUsage: async (): Promise<ApiResponse<ChartData[]>> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      message: 'Application usage data fetched successfully',
      data: [
        { name: 'Slack', value: 35, fill: '#0ea5e9' },
        { name: 'VS Code', value: 25, fill: '#8b5cf6' },
        { name: 'Chrome', value: 20, fill: '#10b981' },
        { name: 'Figma', value: 12, fill: '#f59e0b' },
        { name: 'Others', value: 8, fill: '#6b7280' }
      ]
    };
  }
};