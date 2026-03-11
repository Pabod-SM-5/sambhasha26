import React from 'react';
import AdminLayout from '../components/Admin/AdminLayout';
import StatsPanel from '../components/Admin/StatsPanel';
import SchoolsTable from '../components/Admin/SchoolsTable';
import { RefreshCw, FileText } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h2>
            <p className="text-sm text-white/40 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Status: Optimal
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-[#141414] text-white border border-red-900/30 rounded-xl font-bold uppercase tracking-wider text-[10px] sm:text-xs hover:bg-[#1a1a1a] transition-all duration-300 flex items-center gap-2 shadow-lg shadow-black/50 hover:shadow-black/70 hover:-translate-y-0.5">
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <StatsPanel />

        {/* Schools Table Section */}
        <SchoolsTable />
      </div>
    </AdminLayout>
  );
}
