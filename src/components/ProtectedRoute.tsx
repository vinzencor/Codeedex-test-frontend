import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  requiredPermission?: string;
  requiredScope?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredPermission, requiredScope }) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredScope && user.role.scope !== 'GLOBAL' && user.role.scope !== requiredScope) {
     return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
