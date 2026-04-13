import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Roles from './pages/Roles';
import AuditLogs from './pages/AuditLogs';

const Unauthorized = () => (
  <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '16px' }}>
    <h1 style={{ color: 'var(--danger)' }}>403 - Unauthorized</h1>
    <p style={{ color: 'var(--text-secondary)' }}>You lack the required permissions or scope to view this page.</p>
    <a href="/" style={{ color: 'var(--accent-primary)', textDecoration: 'underline' }}>Return to Dashboard</a>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          <Route element={<Layout />}>
            {/* Base Dashboard for all authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
            </Route>

            {/* Users accessible if users:read permission */}
            <Route element={<ProtectedRoute requiredPermission="users:read" />}>
              <Route path="/users" element={<Users />} />
            </Route>

            {/* Roles and Audit require GLOBAL scope */}
            <Route element={<ProtectedRoute requiredScope="GLOBAL" />}>
              <Route path="/roles" element={<Roles />} />
              <Route path="/audit" element={<AuditLogs />} />
            </Route>

          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
