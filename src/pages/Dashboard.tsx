import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Users, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Role Level', value: user?.role.name, icon: Shield },
    { label: 'Data Scope', value: user?.role.scope, icon: Users },
    { label: 'Permissions', value: user?.role.permissions?.length || 0, icon: Activity },
  ];

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome back, {user?.name}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Here is your access control overview.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                <Icon size={24} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>{stat.label}</p>
                <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '16px' }}>Your Assigned Permissions</h3>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {user?.role.permissions?.map((p, i) => (
            <span key={i} style={{ padding: '6px 12px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
              {p.name}
            </span>
          ))}
          {(!user?.role.permissions || user.role.permissions.length === 0) && (
            <span style={{ color: 'var(--text-muted)' }}>No specific permissions assigned.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
