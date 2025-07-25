import React, { useEffect, useState } from 'react';
import { Building, Crown, Users, Mail, Calendar, ArrowUpRight } from 'lucide-react';
import { organizationApi } from '../api/organization';
import { Organization } from '../types';
import { PLAN_TYPES } from '../utils/constants';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';

export const OrgSettings: React.FC = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrganization();
  }, []);

  const fetchOrganization = async () => {
    try {
      setIsLoading(true);
      const response = await organizationApi.getOrganization();
      if (response.success) {
        setOrganization(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch organization:', error);
      toast.error('Failed to load organization data');
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case PLAN_TYPES.FREE:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case PLAN_TYPES.PREMIUM:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case PLAN_TYPES.ENTERPRISE:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case PLAN_TYPES.PREMIUM:
      case PLAN_TYPES.ENTERPRISE:
        return <Crown className="w-4 h-4" />;
      default:
        return <Building className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Settings</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SkeletonLoader className="h-40" />
            <SkeletonLoader className="h-60" />
          </div>
          <div className="space-y-6">
            <SkeletonLoader className="h-32" />
            <SkeletonLoader className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 dark:text-gray-400">Failed to load organization data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Organization Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Organization Info */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Organization Information
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <Building className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Organization Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{organization.name}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Billing Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{organization.billingEmail}</p>
                </div>
              </div>

              <div className="flex items-center">
                <Users className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Users</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {organization.currentUsers} / {organization.maxUsers}
                  </p>
                </div>
              </div>

              {organization.subscriptionEnd && (
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Subscription Ends</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {new Date(organization.subscriptionEnd).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Available Features
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {organization.features.map((feature, index) => (
                <div key={index} className="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Current Plan
            </h2>
            
            <div className="text-center">
              <div className="inline-flex items-center mb-3">
                {getPlanIcon(organization.plan)}
                <span className={`ml-2 px-3 py-1 text-sm font-semibold rounded-full ${getPlanColor(organization.plan)}`}>
                  {organization.plan.charAt(0).toUpperCase() + organization.plan.slice(1)}
                </span>
              </div>
              
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                ${organization.plan === PLAN_TYPES.FREE ? '0' : organization.plan === PLAN_TYPES.PREMIUM ? '29' : '99'}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/month</span>
              </p>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Up to {organization.maxUsers} users
              </p>

              {organization.plan === PLAN_TYPES.FREE && (
                <button className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                  Upgrade Plan
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          </div>

          {/* Usage Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Usage Statistics
            </h2>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Users</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {organization.currentUsers}/{organization.maxUsers}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(organization.currentUsers / organization.maxUsers) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Storage</span>
                  <span className="font-medium text-gray-900 dark:text-white">2.1GB/10GB</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '21%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">API Calls</span>
                  <span className="font-medium text-gray-900 dark:text-white">8.5K/25K</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '34%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};