import { useState, useEffect } from 'react';
import { api } from '../../../../utils/api';

interface ActivityLog {
  id: number;
  user?: {
    id: number;
    username: string;
    email: string;
    fullName: string;
  };
  action: 'create' | 'update' | 'delete' | 'restore' | 'login' | 'logout';
  page: string | null;
  section: string | null;
  field?: string | null;
  oldValue?: string | null;
  newValue?: string | null;
  description?: string | null;
  createdAt: string;
  ipAddress: string | null;
}

export default function ActivityLogsPage() {
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterPage, setFilterPage] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalActions: 0,
    updates: 0,
    deletions: 0,
    creates: 0,
    restores: 0,
    logins: 0
  });

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [filterAction, filterPage, searchQuery, dateRange]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params: any = {
        limit: 100,
        offset: 0
      };
      if (filterAction !== 'all') params.action = filterAction;
      if (filterPage !== 'all') params.page = filterPage;
      if (searchQuery) params.search = searchQuery;
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;

      const response = await api.get(`/activity-logs?${new URLSearchParams(params)}`);
      if (response.success && response.data) {
        setLogs((response.data as any).logs || []);
      }
    } catch (error: any) {
      console.error('Error fetching logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const params: any = {};
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;

      const response = await api.get(`/activity-logs/stats?${new URLSearchParams(params)}`);
      if (response.success && response.data) {
        setStats(response.data as any);
      }
    } catch (error: any) {
      console.error('Error fetching stats:', error);
    }
  };

  // Legacy mock data removed - now using real API

  const actionColors = {
    create: 'bg-green-100 text-green-800',
    update: 'bg-blue-100 text-blue-800',
    delete: 'bg-red-100 text-red-800',
    restore: 'bg-purple-100 text-purple-800',
    login: 'bg-gray-100 text-gray-800',
    logout: 'bg-gray-100 text-gray-800'
  };

  const actionIcons = {
    create: 'ri-add-circle-line',
    update: 'ri-edit-line',
    delete: 'ri-delete-bin-line',
    restore: 'ri-restart-line',
    login: 'ri-login-box-line',
    logout: 'ri-logout-box-line'
  };

  const filteredLogs = logs; // Already filtered by API

  const exportLogs = async () => {
    try {
      const params: any = {};
      if (filterAction !== 'all') params.action = filterAction;
      if (filterPage !== 'all') params.page = filterPage;
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;

      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api/v1'}/activity-logs/export?${new URLSearchParams(params)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    } catch (error: any) {
      alert('Error exporting logs: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-gray-900">Activity Logs</h2>
            <p className="text-sm text-gray-600 mt-1">Track all user actions and changes</p>
          </div>
          <button
            onClick={exportLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-download-line"></i>
            <span>Export Logs</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user, email, page..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Action Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">All Actions</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="restore">Restore</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
            </select>
          </div>

          {/* Page Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Page</label>
            <select
              value={filterPage}
              onChange={(e) => setFilterPage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">All Pages</option>
              <option value="Home">Home</option>
              <option value="About">About</option>
              <option value="Products">Products</option>
              <option value="Awards">Awards</option>
              <option value="Careers">Careers</option>
              <option value="Contact">Contact</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="flex space-x-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="flex-1 px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Section</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Changes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No activity logs found
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.user?.fullName || log.user?.username || 'System'}</div>
                      <div className="text-xs text-gray-500">{log.user?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${actionColors[log.action]}`}>
                        <i className={`${actionIcons[log.action]} mr-1`}></i>
                        {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.page || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.section || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {log.field && (
                        <div className="space-y-1">
                          <div className="font-medium">{log.field}</div>
                          {log.oldValue && (
                            <div className="text-xs text-red-600">
                              <span className="font-medium">From:</span> {String(log.oldValue).substring(0, 50)}{String(log.oldValue).length > 50 ? '...' : ''}
                            </div>
                          )}
                          {log.newValue && (
                            <div className="text-xs text-green-600">
                              <span className="font-medium">To:</span> {String(log.newValue).substring(0, 50)}{String(log.newValue).length > 50 ? '...' : ''}
                            </div>
                          )}
                        </div>
                      )}
                      {!log.field && log.description && (
                        <div className="text-xs text-gray-500">{log.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.ipAddress || 'N/A'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Actions</p>
              <p className="text-2xl font-medium text-gray-900 mt-1">{stats.totalActions}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-bar-chart-line text-2xl text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Updates</p>
              <p className="text-2xl font-medium text-gray-900 mt-1">
                {stats.updates}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-edit-line text-2xl text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Deletions</p>
              <p className="text-2xl font-medium text-gray-900 mt-1">
                {stats.deletions}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="ri-delete-bin-line text-2xl text-red-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Logins</p>
              <p className="text-2xl font-medium text-gray-900 mt-1">
                {stats.logins}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-login-box-line text-2xl text-purple-600"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
