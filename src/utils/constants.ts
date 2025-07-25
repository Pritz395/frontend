export const API_BASE_URL = '/api'; // Use relative path for proxy

export const USER_ROLES = {
  EMPLOYEE: 'employee',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin'
} as const;

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended'
} as const;

export const PLAN_TYPES = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
} as const;

export const ACTIVITY_TYPES = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  FILE_ACCESS: 'file_access',
  APP_USAGE: 'app_usage',
  SCREEN_TIME: 'screen_time'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
export type UserStatus = typeof USER_STATUS[keyof typeof USER_STATUS];
export type PlanType = typeof PLAN_TYPES[keyof typeof PLAN_TYPES];
export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES];