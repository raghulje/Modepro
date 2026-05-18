import { useState, useEffect } from 'react';
import { api } from '../../../../utils/api';

interface BackendUser {
  id: number;
  username: string;
  email: string;
  fullName: string | null;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  permissions?: PagePermissions | null;
}

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

type Permission = {
  view: boolean;
  edit: boolean;
  delete: boolean;
};

type PagePermissions = {
  [key: string]: Permission;
};

const MODEPRO_PAGES = [
  'home',
  'header-footer',
  'about',
  'products',
  'gallery',
  'pages',
  'smtp',
  'users',
] as const;

const fullAccess = (): PagePermissions =>
  Object.fromEntries(MODEPRO_PAGES.map((p) => [p, { view: true, edit: true, delete: true }]));

const editorAccess = (): PagePermissions =>
  Object.fromEntries(
    MODEPRO_PAGES.map((p) => [
      p,
      { view: true, edit: p !== 'users' && p !== 'smtp', delete: false },
    ])
  );

const viewerAccess = (): PagePermissions =>
  Object.fromEntries(MODEPRO_PAGES.map((p) => [p, { view: p !== 'users' && p !== 'smtp', edit: false, delete: false }]));

const defaultPermissions: Record<string, PagePermissions> = {
  super_admin: fullAccess(),
  admin: {
    ...fullAccess(),
    users: { view: true, edit: true, delete: false },
    smtp: { view: true, edit: false, delete: false },
  },
  editor: editorAccess(),
  viewer: viewerAccess(),
};

const pageLabels: Record<string, { label: string; icon: string }> = {
  home: { label: 'Home', icon: 'ri-home-line' },
  'header-footer': { label: 'Header & Footer', icon: 'ri-layout-line' },
  about: { label: 'About', icon: 'ri-information-line' },
  products: { label: 'Products', icon: 'ri-product-hunt-line' },
  gallery: { label: 'Gallery', icon: 'ri-image-line' },
  pages: { label: 'CMS Pages', icon: 'ri-file-text-line' },
  users: { label: 'Users', icon: 'ri-user-settings-line' },
  smtp: { label: 'SMTP', icon: 'ri-mail-settings-line' },
};

export default function UserManagement() {
  const [view, setView] = useState<'list' | 'create' | 'edit'>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'editor' as User['role'],
    status: 'active' as User['status']
  });

  // Custom permissions that override role-based defaults
  const [customPermissions, setCustomPermissions] = useState<PagePermissions | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get<BackendUser[]>('/users');
      if (response.success && response.data) {
        const mappedUsers: User[] = (response.data as BackendUser[]).map(user => ({
          id: user.id,
          username: user.username,
          name: user.fullName || user.username,
          email: user.email,
          role: user.role,
          status: user.isActive ? 'active' : 'inactive',
          createdAt: new Date(user.createdAt).toLocaleDateString(),
          lastLogin: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never'
        }));
        setUsers(mappedUsers);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      alert(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setFormData({
      username: '',
      name: '',
      email: '',
      password: '',
      role: 'editor',
      status: 'active'
    });
    setSelectedUser(null);
    setView('create');
  };

  const handleEditUser = async (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status
    });
    
    // Fetch full user data to get permissions
    try {
      const response = await api.get(`/users/${user.id}`);
      if (response.success && response.data) {
        const fullUser = response.data as any;
        // If user has custom permissions, load them; otherwise use null (role defaults)
        if (fullUser.permissions && Object.keys(fullUser.permissions).length > 0) {
          setCustomPermissions(fullUser.permissions);
        } else {
          setCustomPermissions(null);
        }
      }
    } catch (error: any) {
      console.error('Error fetching user details:', error);
      setCustomPermissions(null);
    }
    
    setView('edit');
  };

  const handleSave = async () => {
    if (!formData.email || !formData.username) {
      alert('Email and username are required');
      return;
    }

    if (view === 'create' && !formData.password) {
      alert('Password is required when creating a new user');
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        username: formData.username,
        email: formData.email,
        fullName: formData.name,
        role: formData.role,
        permissions: customPermissions || null // Send custom permissions or null to use role defaults
      };

      if (view === 'create') {
        payload.password = formData.password;
        const response = await api.post('/users', payload);
        if (response.success) {
          alert('User created successfully!');
          fetchUsers();
          setView('list');
          setSelectedUser(null);
          setCustomPermissions(null);
        } else {
          throw new Error(response.message || 'Failed to create user');
        }
      } else {
        // Edit mode
        if (!selectedUser) return;
        payload.isActive = formData.status === 'active';
        if (formData.password) {
          payload.password = formData.password;
        }
        const response = await api.put(`/users/${selectedUser.id}`, payload);
        if (response.success) {
          alert('User updated successfully!');
          fetchUsers();
          setView('list');
          setSelectedUser(null);
          setCustomPermissions(null);
        } else {
          throw new Error(response.message || 'Failed to update user');
        }
      }
    } catch (error: any) {
      console.error('Error saving user:', error);
      alert(error.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setView('list');
    setSelectedUser(null);
  };

  const handleRoleChange = (role: User['role']) => {
    setFormData({ ...formData, role });
    // Reset custom permissions when role changes (use role defaults)
    setCustomPermissions(null);
  };

  // Get current permissions (custom or role-based)
  const getCurrentPermissions = (): PagePermissions => {
    if (customPermissions) {
      return customPermissions;
    }
    return defaultPermissions[formData.role] || defaultPermissions.editor;
  };

  const handlePermissionChange = (page: string, permission: 'view' | 'edit' | 'delete', value: boolean) => {
    const current = getCurrentPermissions();
    const updated = {
      ...current,
      [page]: {
        ...current[page],
        [permission]: value
      }
    };
    setCustomPermissions(updated);
  };

  const resetToRoleDefaults = () => {
    setCustomPermissions(null);
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setSaving(true);
    try {
      const response = await api.delete(`/users/${userId}`);
      if (response.success) {
        alert('User deleted successfully!');
        fetchUsers();
      } else {
        throw new Error(response.message || 'Failed to delete user');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(error.message || 'Failed to delete user');
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadgeColor = (role: User['role']) => {
    switch (role) {
      case 'super_admin': return 'bg-[#7C3AED] text-white';
      case 'admin': return 'bg-[#0798bc] text-white';
      case 'editor': return 'bg-[#10B981] text-white';
      case 'viewer': return 'bg-[#6B7280] text-white';
      default: return 'bg-[#6B7280] text-white';
    }
  };

  const getStatusBadgeColor = (status: User['status']) => {
    return status === 'active' 
      ? 'bg-[#D1FAE5] text-[#065F46]' 
      : 'bg-[#FEE2E2] text-[#991B1B]';
  };

  if (loading && users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0798bc]"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* User List View */}
      {view === 'list' && (
        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-[#1F2937]">User Management</h2>
              <p className="text-sm text-[#6B7280] mt-1">Manage admin users and their permissions</p>
            </div>
            <button
              onClick={handleCreateUser}
              className="flex items-center space-x-2 px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#059669] transition-all duration-300 cursor-pointer whitespace-nowrap"
            >
              <i className="ri-user-add-line"></i>
              <span>Add New User</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#E5E7EB]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Created</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Last Login</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#6B7280]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const permissions = defaultPermissions[user.role];
                  const hasViewPermission = Object.values(permissions).some(p => p.view);
                  const hasEditPermission = Object.values(permissions).some(p => p.edit);
                  const hasDeletePermission = Object.values(permissions).some(p => p.delete);
                  
                  return (
                    <tr key={user.id} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm font-medium text-[#1F2937]">{user.name}</p>
                          <p className="text-xs text-[#6B7280]">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                          {user.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-[#6B7280]">
                        {user.createdAt}
                      </td>
                      <td className="py-4 px-4 text-sm text-[#6B7280]">
                        {user.lastLogin}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-2 text-[#0798bc] hover:bg-[#E6F7FA] rounded-lg transition-all duration-300 cursor-pointer"
                            title="Edit User"
                          >
                            <i className="ri-edit-line"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-all duration-300 cursor-pointer"
                            title="Delete User"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-[#6B7280]">
                      No users found. Click "Add New User" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit User Form */}
      {(view === 'create' || view === 'edit') && (
        <div className="bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1F2937]">
              {view === 'create' ? 'Create New User' : `Edit User: ${selectedUser?.name}`}
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-[#F3F4F6] text-[#6B7280] rounded-lg hover:bg-[#E5E7EB] transition-all duration-300 cursor-pointer whitespace-nowrap"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-[#0798bc] text-white rounded-lg hover:bg-[#076e88] transition-all duration-300 cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : (view === 'create' ? 'Create User' : 'Save Changes')}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1F2937] border-b pb-2">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Username *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#0798bc] focus:border-transparent transition-all"
                  placeholder="Enter username"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#0798bc] focus:border-transparent transition-all"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#0798bc] focus:border-transparent transition-all"
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">
                  {view === 'create' ? 'Password *' : 'New Password (leave blank to keep current)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#0798bc] focus:border-transparent transition-all"
                  placeholder="Enter password"
                  required={view === 'create'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => handleRoleChange(e.target.value as User['role'])}
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#0798bc] focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="super_admin">Super Admin - Full access to everything</option>
                  <option value="admin">Admin - Manage content and users</option>
                  <option value="editor">Editor - Edit content only</option>
                  <option value="viewer">Viewer - View only access</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#374151] mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as User['status'] })}
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-2 focus:ring-[#0798bc] focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Permissions Management */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#1F2937] border-b pb-2 flex-1">Permissions</h3>
                {customPermissions && (
                  <button
                    onClick={resetToRoleDefaults}
                    className="text-sm text-[#0798bc] hover:text-[#076e88] cursor-pointer"
                    title="Reset to role defaults"
                  >
                    <i className="ri-refresh-line mr-1"></i>Reset to Defaults
                  </button>
                )}
              </div>
              
              <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-4">
                <p className="text-sm text-[#6B7280] mb-4">
                  {customPermissions 
                    ? 'Custom permissions (overriding role defaults)' 
                    : 'Permissions are automatically set based on the selected role. You can customize them below:'}
                </p>

                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {Object.entries(getCurrentPermissions()).map(([page, perms]) => {
                    const pageInfo = pageLabels[page] || { label: page, icon: 'ri-file-line' };
                    return (
                      <div key={page} className="bg-white rounded-lg border border-[#E5E7EB] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-[#1F2937] flex items-center space-x-2">
                            <i className={`${pageInfo.icon} text-[#6B7280]`}></i>
                            <span>{pageInfo.label}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-6">
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={perms.view}
                              onChange={(e) => handlePermissionChange(page, 'view', e.target.checked)}
                              className="w-4 h-4 text-[#10B981] border-gray-300 rounded focus:ring-[#10B981] cursor-pointer"
                            />
                            <span className={`text-xs px-2 py-1 rounded ${perms.view ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                              View {perms.view ? '✓' : ''}
                            </span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={perms.edit}
                              onChange={(e) => handlePermissionChange(page, 'edit', e.target.checked)}
                              disabled={!perms.view}
                              className="w-4 h-4 text-[#10B981] border-gray-300 rounded focus:ring-[#10B981] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span className={`text-xs px-2 py-1 rounded ${perms.edit ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                              Edit {perms.edit ? '✓' : ''}
                            </span>
                          </label>
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={perms.delete}
                              onChange={(e) => handlePermissionChange(page, 'delete', e.target.checked)}
                              disabled={!perms.edit}
                              className="w-4 h-4 text-[#10B981] border-gray-300 rounded focus:ring-[#10B981] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <span className={`text-xs px-2 py-1 rounded ${perms.delete ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                              Delete {perms.delete ? '✓' : ''}
                            </span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-[#E6F7FA] border border-[#B3E5F0] rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <i className="ri-information-line text-[#0798bc] text-xl mt-0.5"></i>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[#076e88] mb-1">Permission Guidelines</h4>
                    <ul className="text-sm text-[#076e88] space-y-1">
                      <li><strong>View:</strong> User can see the page/section content</li>
                      <li><strong>Edit:</strong> User can modify existing content (requires View)</li>
                      <li><strong>Delete:</strong> User can remove content (requires Edit)</li>
                    </ul>
                    <p className="text-xs text-[#076e88] mt-2">
                      You can customize permissions by checking/unchecking the boxes above. Changes will override the role defaults.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
