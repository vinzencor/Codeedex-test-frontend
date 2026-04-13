import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, Shield, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Layout: React.FC = () => {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, show: true },
    { name: 'Users', path: '/users', icon: Users, show: hasPermission('users:read') },
    { name: 'Roles & Permissions', path: '/roles', icon: Shield, show: user?.role.scope === 'GLOBAL' },
    { name: 'Audit Logs', path: '/audit', icon: Activity, show: user?.role.scope === 'GLOBAL' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <div style={{ width: '260px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 24px', marginBottom: '32px' }}>
          <h2 style={{ color: 'var(--accent-primary)', fontSize: '1.5rem' }}>SecureApp</h2>
        </div>
        
        <nav style={{ flex: 1 }}>
          {navItems.filter(item => item.show).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 24px',
                color: isActive ? 'white' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-light)' : 'transparent',
                borderRight: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                transition: 'all 0.2s',
              }}>
                <Icon size={20} color={isActive ? 'var(--accent-primary)' : 'currentColor'} />
                <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ marginBottom: '16px' }}>
            <p style={{ fontWeight: 600, color: 'white', fontSize: '0.9rem' }}>{user?.name}</p>
            <p style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', marginTop: '4px' }}>
              {user?.role.name} ({user?.role.scope})
            </p>
          </div>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', width: '100%', padding: '8px 0', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{ height: '70px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 32px', background: 'var(--bg-glass)', backdropFilter: 'blur(12px)' }}>
           <h3 style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
             {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
           </h3>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
