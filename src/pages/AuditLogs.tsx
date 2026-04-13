import React, { useEffect, useState } from 'react';
import api from '../utils/api';
// import { format } from 'date-fns'; // Removed unused import

interface IAuditLog {
  _id: string;
  action: string;
  actor: { name: string; email: string };
  targetModel: string;
  createdAt: string;
}

const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/audit-logs');
        setLogs(res.data.logs);
      } catch (error) {
        console.error("Failed to load audit logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2>System Audit Logs</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Immutable record of all sensitive system actions.</p>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>Timestamp</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>Action</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>Actor</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>Target Model</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center' }}>Loading logs...</td></tr>
            ) : logs.map(log => (
              <tr key={log._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {new Date(log.createdAt).toLocaleString()}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</span>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div>{log.actor?.name || 'System'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.actor?.email}</div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {log.targetModel}
                  </span>
                </td>
              </tr>
            ))}
            {logs.length === 0 && !loading && (
              <tr><td colSpan={4} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>No logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditLogs;
