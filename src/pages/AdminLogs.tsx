import React, { useState } from 'react';
import AdminLayout from '../components/Admin/AdminLayout';
import { Search, Filter, AlertCircle, CheckCircle, Info, AlertTriangle, Download, RefreshCw } from 'lucide-react';

// Mock Data for Logs
const MOCK_LOGS = [
  { id: 'LOG-001', timestamp: '2024-03-15T10:30:00Z', user: 'ADMIN_01', type: 'AUTH_SUCCESS', description: 'Successful login detected', status: 'Success' },
  { id: 'LOG-002', timestamp: '2024-03-15T10:35:12Z', user: 'ADMIN_01', type: 'CONTESTANT_ADD', description: 'Added contestant C008 (Tharindu)', status: 'Success' },
  { id: 'LOG-003', timestamp: '2024-03-15T11:05:45Z', user: 'SYSTEM', type: 'BACKUP_AUTO', description: 'Daily database backup completed', status: 'Success' },
  { id: 'LOG-004', timestamp: '2024-03-15T11:20:00Z', user: 'ADMIN_02', type: 'REGISTRATION_PAUSE', description: 'Paused global registration', status: 'Warning' },
  { id: 'LOG-005', timestamp: '2024-03-15T11:22:30Z', user: 'ADMIN_02', type: 'CATEGORY_UPDATE', description: 'Updated age tiers for Robotics', status: 'Success' },
  { id: 'LOG-006', timestamp: '2024-03-15T12:00:01Z', user: 'SYSTEM', type: 'API_ERROR', description: 'Failed to sync with external mail server', status: 'Error' },
  { id: 'LOG-007', timestamp: '2024-03-15T12:15:00Z', user: 'ADMIN_01', type: 'CONTESTANT_DELETE', description: 'Removed entry C004 (Ruwan)', status: 'Success' },
  { id: 'LOG-008', timestamp: '2024-03-15T12:30:00Z', user: 'ADMIN_03', type: 'AUTH_FAIL', description: 'Failed login attempt from IP 192.168.1.5', status: 'Warning' },
  { id: 'LOG-009', timestamp: '2024-03-15T13:00:00Z', user: 'ADMIN_01', type: 'EXPORT_DATA', description: 'Exported contestants CSV', status: 'Info' },
  { id: 'LOG-010', timestamp: '2024-03-15T13:45:00Z', user: 'SYSTEM', type: 'CACHE_CLEAR', description: 'System cache purged', status: 'Success' },
];

const LOG_TYPES = ['All', 'AUTH_SUCCESS', 'AUTH_FAIL', 'CONTESTANT_ADD', 'CONTESTANT_DELETE', 'REGISTRATION_PAUSE', 'API_ERROR', 'INFO'];

export default function AdminLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Filter Logic
  const filteredLogs = MOCK_LOGS.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || log.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'Warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'Error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Success': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Warning': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Error': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">System Logs & Audit Trail</h2>
            <p className="text-sm text-white/40 mt-1">Chronological record of all administrative and system actions</p>
          </div>
          <div className="flex gap-3">
             <button className="px-4 py-2 bg-[#141414] hover:bg-[#1a1a1a] text-white/80 hover:text-white text-sm font-medium rounded-xl border border-red-900/30 transition-all flex items-center gap-2 shadow-lg shadow-black/50">
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button className="px-4 py-2 bg-[#141414] hover:bg-[#1a1a1a] text-white text-sm font-medium rounded-xl border border-red-900/30 transition-all flex items-center gap-2 shadow-lg shadow-black/50">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Logs</span>
            </button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 bg-[#0a0a0a]/80 backdrop-blur-md p-4 rounded-2xl border border-red-900/30">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              placeholder="Search by User, Event Type, or Description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#141414]/50 border border-red-900/30 rounded-lg pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-900/50 transition-colors"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full bg-[#141414]/50 border border-red-900/30 rounded-lg pl-10 pr-8 py-3 text-sm text-white focus:outline-none focus:border-red-900/50 appearance-none cursor-pointer"
              >
                {LOG_TYPES.map(type => (
                  <option key={type} value={type}>{type === 'All' ? 'All Event Types' : type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl overflow-hidden shadow-lg shadow-black/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#141414]/80">
                <tr className="border-b border-red-900/30">
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider whitespace-nowrap">Timestamp</th>
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider whitespace-nowrap">User / Actor</th>
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider whitespace-nowrap">Event Type</th>
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider text-right whitespace-nowrap">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-900/30">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="group hover:bg-[#141414]/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-white/60 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-white whitespace-nowrap">
                        {log.user}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#141414] border border-red-900/30 text-xs font-mono text-white/70">
                          {log.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/80 min-w-[200px]">
                        {log.description}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium border ${getStatusStyle(log.status)}`}>
                          {getStatusIcon(log.status)}
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-white/20 text-sm">
                      No logs found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-red-900/30 bg-[#0a0a0a]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <span>Showing {filteredLogs.length} records</span>
            <div className="flex gap-1">
              <button className="px-3 py-1.5 hover:bg-[#141414] rounded-lg disabled:opacity-50 transition-colors" disabled>Prev</button>
              <button className="px-3 py-1.5 bg-[#141414] text-white rounded-lg transition-colors border border-red-900/30">1</button>
              <button className="px-3 py-1.5 hover:bg-[#141414] rounded-lg transition-colors">2</button>
              <button className="px-3 py-1.5 hover:bg-[#141414] rounded-lg transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
