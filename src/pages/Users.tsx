import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, ShieldAlert, X } from 'lucide-react';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: { name: string; scope: string; _id: string };
  team?: { name: string; _id: string };
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<{_id: string, name: string}[]>([]);
  const [teams, setTeams] = useState<{_id: string, name: string}[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', roleId: '', teamId: '' });
  
  const { hasPermission } = useAuth();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to load users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    // Fetch roles and teams for the dropdowns
    if (hasPermission('users:create')) {
        api.get('/roles').then(res => setRoles(res.data.roles)).catch(console.error);
        api.get('/teams').then(res => setTeams(res.data.teams)).catch(console.error);
    }
  }, [hasPermission]);

  const handleCreateUser = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await api.post('/users', formData);
          setShowModal(false);
          setFormData({ name: '', email: '', password: '', roleId: '', teamId: '' });
          fetchUsers(); // Refresh list
      } catch (err) {
          console.error("Error creating user", err);
          alert("Failed to create user. Check console.");
      }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2>User Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>View users in your authorized scope.</p>
        </div>
        {hasPermission('users:create') && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>Add New User</button>
        )}
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>Email</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>Role</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>Team</th>
              <th style={{ padding: '16px 24px', color: 'var(--text-secondary)', fontWeight: 500 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center' }}>Loading...</td></tr>
            ) : users.map(user => (
              <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px 24px', fontWeight: 500 }}>{user.name}</td>
                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{user.email}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--accent-light)', color: 'var(--accent-primary)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem' }}>
                    {user.role?.scope === 'GLOBAL' ? <ShieldAlert size={14} /> : null}
                    {user.role?.name || 'Unknown'}
                  </span>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text-secondary)' }}>{user.team?.name || '-'}</td>
                <td style={{ padding: '16px 24px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--success)' }}>
                    <CheckCircle2 size={16} /> Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div className="glass-card" style={{ width: '400px', background: 'var(--bg-secondary)', padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <h3>Add New User</h3>
                      <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
                  </div>
                  <form onSubmit={handleCreateUser}>
                      <div className="form-group">
                          <label>Full Name</label>
                          <input required className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="form-group">
                          <label>Email Address</label>
                          <input required type="email" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                      </div>
                      <div className="form-group">
                          <label>Password</label>
                          <input required type="password" className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                      </div>
                      <div className="form-group">
                          <label>Assign Role</label>
                          <select required className="input-field" style={{background: 'var(--bg-secondary)'}} value={formData.roleId} onChange={e => setFormData({...formData, roleId: e.target.value})}>
                              <option value="">Select Role</option>
                              {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
                          </select>
                      </div>
                      <div className="form-group">
                          <label>Assign Team</label>
                          <select className="input-field" style={{background: 'var(--bg-secondary)'}} value={formData.teamId} onChange={e => setFormData({...formData, teamId: e.target.value})}>
                              <option value="">No Team</option>
                              {teams.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                          </select>
                      </div>
                      <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '16px' }}>Create User</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Users;
