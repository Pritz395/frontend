import { UserRole, UserStatus, PlanType, ActivityType } from '../utils/constants';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  lastActive: string;
  createdAt: string;
  department?: string;
}

export interface AuthUser extends User {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  type: ActivityType;
  description: string;
  application?: string;
  duration?: number;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  logsToday: number;
  averageScreenTime: number;
  trends: {
    users: number;
    activity: number;
    screenTime: number;
  };
}

export interface Organization {
  id: string;
  name: string;
  plan: PlanType;
  maxUsers: number;
  currentUsers: number;
  features: string[];
  billingEmail: string;
  subscriptionEnd?: string;
}

export interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}