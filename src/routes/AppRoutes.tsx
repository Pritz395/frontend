import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { ProtectedRoute } from './ProtectedRoute';
import { Login } from '../pages/Login';
import { Dashboard } from '../pages/Dashboard';
import { Users } from '../pages/Users';
import { Logs } from '../pages/Logs';
import { OrgSettings } from '../pages/OrgSettings';
import Signup from '../pages/Signup';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route 
          path="users" 
          element={
            <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
              <Users />
            </ProtectedRoute>
          } 
        />
        <Route path="logs" element={<Logs />} />
        <Route 
          path="settings" 
          element={
            <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
              <OrgSettings />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};