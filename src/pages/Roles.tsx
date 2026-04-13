import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Shield, X } from 'lucide-react';

interface IPermission {
  _id: string;
  name: string;
  description: string;
  module: string;
}

interface IRole {
  _id: string;
  name: string;
  description: string;
  scope: string;
  permissions: { _id: string, name: string }[];
}

const Roles: React.FC = () => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [allPermissions, setAllPermissions] = useState<IPermission[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [editingRole, setEditingRole] = useState<IRole | null>(null);
  const [newPermissionsList, setNewPermissionsList] = useState<string[]>([]); // array of permission IDs
  const [saving, setSaving] = useState(false);

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles');
      setRoles(res.data.roles);
    } catch (error) {
      console.error("Failed to load roles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    api.get('/roles/permissions').then(res => setAllPermissions(res.data.permissions)).catch(console.error);
  }, []);

  const openAppModal = (role: IRole) => {
      setEditingRole(role);
      // prepopulate the checkboxes with existing permissions
      setNewPermissionsList(role.permissions.map(p => p._id));
  };

  const handleTogglePermission = (permId: string) => {
      setNewPermissionsList(prev => 
          prev.includes(permId) ? prev.filter(id => id !== permId) : [...prev, permId]
      );
  };

  const handleUpdateRole = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingRole) return;
      
      setSaving(true);
      try {
          await api.put(`/roles/${editingRole._id}`, {
              permissions: newPermissionsList
          });
          setEditingRole(null);
          fetchRoles(); // Refresh the grid
      } catch(err) {
          console.error("Error updating role", err);
          alert("Failed to update role. Check console.");
      } finally {
          setSaving(false);
      }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2>Roles & Permissions Configurator</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage access levels and their associated data scopes.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {loading ? (
          <div>Loading roles...</div>
        ) : roles.map(role => (
          <div key={role._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} color="var(--accent-primary)" />
                  {role.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{role.description}</p>
              </div>
              <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '1px' }}>
                {role.scope} SCOPE
              </span>
            </div>

            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Assigned Permissions:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {role.permissions.map((p, i) => (
                  <span key={i} style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--accent-light)', color: 'var(--text-primary)', fontSize: '0.75rem' }}>
                    {p.name}
                  </span>
                ))}
                {role.permissions.length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>None</span>}
              </div>
            </div>
            
            <button className="btn-primary" style={{ marginTop: '24px', width: '100%' }} onClick={() => openAppModal(role)}>Edit Role Capabilities</button>
          </div>
        ))}
      </div>

      {/* Edit Role Modal */}
      {editingRole && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
              <div className="glass-card" style={{ width: '500px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-secondary)', padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h3>Edit {editingRole.name}</h3>
                      <button onClick={() => setEditingRole(null)} style={{ color: 'var(--text-secondary)' }}><X size={20} /></button>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>Toggle the permissions granted to this role below.</p>
                  
                  <form onSubmit={handleUpdateRole}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                          {/* Group permissions by module if desired, but a flat list works for prototype */}
                          {allPermissions.map((perm) => (
                              <label key={perm._id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer' }}>
                                  <input 
                                      type="checkbox" 
                                      checked={newPermissionsList.includes(perm._id)}
                                      onChange={() => handleTogglePermission(perm._id)}
                                      style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
                                  />
                                  <div>
                                      <div style={{ fontWeight: 500 }}>{perm.name}</div>
                                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{perm.description} ({perm.module})</div>
                                  </div>
                              </label>
                          ))}
                      </div>

                      <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={saving}>
                          {saving ? 'Saving...' : 'Save Role Capabilities'}
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Roles;
