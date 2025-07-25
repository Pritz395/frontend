import React, { useEffect, useState } from 'react';
import { Users, Activity, Clock, TrendingUp } from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { ActivityChart } from '../components/charts/ActivityChart';
import { UsageChart } from '../components/charts/UsageChart';
import { dashboardApi } from '../api/dashboard';
import { DashboardStats, ChartData } from '../types';
import { formatTime } from '../utils/helpers';
import { logsApi } from '../api/logs';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activityData, setActivityData] = useState<ChartData[]>([]);
  const [usageData, setUsageData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
        setIsLoading(true);
      // Fetch summary from backend
      const summaryRes = await logsApi.getSummary();
      // ... process and set stats/activityData/usageData based on summaryRes ...
        setIsLoading(false);
    };
    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          trend={stats?.trends.users}
          icon={<Users className="w-6 h-6" />}
          description="Registered employees"
        />
        <StatCard
          title="Active Users"
          value={stats?.activeUsers || 0}
          trend={stats?.trends.activity}
          icon={<Activity className="w-6 h-6" />}
          description="Currently online"
        />
        <StatCard
          title="Logs Today"
          value={stats?.logsToday || 0}
          icon={<TrendingUp className="w-6 h-6" />}
          description="Activity entries"
        />
        <StatCard
          title="Avg. Screen Time"
          value={stats ? formatTime(stats.averageScreenTime) : '0h 0m'}
          trend={stats?.trends.screenTime}
          icon={<Clock className="w-6 h-6" />}
          description="Per employee"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Activity
          </h3>
          <ActivityChart data={activityData} isLoading={false} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Application Usage
          </h3>
          <UsageChart data={usageData} isLoading={false} />
        </div>
      </div>
    </div>
  );
};