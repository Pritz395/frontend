import React, { useEffect, useState } from 'react';
import { Search, UserPlus, MoreVertical, Trash2 } from 'lucide-react';
import { usersApi } from '../api/users';
import { User, PaginatedResponse, User as UserType } from '../types';
import { USER_ROLES, USER_STATUS } from '../utils/constants';
import { formatDate, getInitials, capitalize } from '../utils/helpers';
import { TableSkeleton } from '../components/ui/SkeletonLoader';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { authApi } from '../api/auth';
import { organizationApi } from '../api/organization';
import { ActivityLog, PaginatedResponse as PaginatedLogResponse } from '../types';
import { logsApi } from '../api/logs';
import { Organization, ApiResponse as OrgApiResponse } from '../types';

// Extend User type locally if needed
type UserWithNames = UserType & { firstName?: string; lastName?: string };

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const { hasRole } = useAuth();
  const [orgPlan, setOrgPlan] = useState<string>('free');
  const [userCount, setUserCount] = useState<number>(0);

  const canManageUsers = hasRole(['admin', 'superadmin']);

  useEffect(() => {
    fetchUsers();
    fetchOrg();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await usersApi.getUsers(currentPage, 10);
      if (response.success) {
        setUsers(response.data.data);
        setTotalPages(response.data.totalPages);
        setUserCount(response.data.total);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrg = async () => {
    try {
      const response = await organizationApi.getOrganization();
      if (response.success) {
        setOrgPlan(response.data.plan);
      }
    } catch (error) {
      console.error('Failed to fetch organization:', error);
      toast.error('Failed to load organization');
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const response = await usersApi.updateUserRole(userId, newRole);
      if (response.success) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, role: newRole as any } : user
        ));
        toast.success('User role updated successfully');
      }
    } catch (error) {
      toast.error('Failed to update user role');
    } finally {
      setEditingRole(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await usersApi.deleteUser(userId);
      if (response.success) {
        setUsers(users.filter(user => user.id !== userId));
        toast.success('User deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = (users as UserWithNames[]).filter(user =>
    (user.name || `${user.firstName || ''} ${user.lastName || ''}`)
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case USER_STATUS.ACTIVE:
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case USER_STATUS.INACTIVE:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case USER_STATUS.SUSPENDED:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const canAddUser = orgPlan !== 'free' || userCount < 5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
        {orgPlan === 'free' && userCount >= 5 && (
          <div className="bg-yellow-100 text-yellow-800 p-3 rounded mb-4">
            Free plan limit reached (max 5 users). Upgrade to add more users.
          </div>
        )}
        {canManageUsers && (
          <button
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            disabled={!canAddUser}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </button>
        )}
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Active
                  </th>
                  {canManageUsers && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {(filteredUsers as UserWithNames[]).map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-3">{getInitials(user.name || `${user.firstName || ''} ${user.lastName || ''}`) as string}</span>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {(user.name || `${user.firstName || ''} ${user.lastName || ''}`)?.trim()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {user.email || ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {canManageUsers && editingRole === user.id ? (
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                          onBlur={() => setEditingRole(null)}
                          className="text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                          autoFocus
                        >
                          {Object.values(USER_ROLES).map(role => (
                            <option key={role} value={role}>
                              {capitalize(role)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                            canManageUsers ? 'hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                          }`}
                          onClick={() => canManageUsers && setEditingRole(user.id)}
                        >
                          {capitalize(user.role)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {capitalize(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(user.lastActive)}
                    </td>
                    {canManageUsers && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};