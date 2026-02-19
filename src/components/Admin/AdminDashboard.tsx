import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardOverview from './DashboardOverview';
import CategoryManager from './CategoryManager';
import SystemLogs from './SystemLogs';
import SchoolProfile from './SchoolProfile';
import AllCompetitors from './AllCompetitors';
import { LogOut, Terminal, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { logSystemAction } from '../../lib/logger';

const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();

  const handleLogout = async () => {
    await logSystemAction('ADMIN_LOGOUT', 'Administrator initiated logout');
    await signOut();
    navigate('/login');
  };

  // Helper to determine title based on path
  const getCurrentSectionTitle = () => {
    const path = location.pathname;
    if (path.includes('categories')) return 'CATEGORY_MGR';
    if (path.includes('competitors')) return 'COMPETITORS_DB';
    if (path.includes('logs')) return 'SYSTEM_LOGS';
    if (path.includes('school')) return 'INTEL';
    return 'DASHBOARD';
  };

  return (
    <div className="min-h-screen bg-dark-950 text-neutral-200 font-sans selection:bg-red-500/30 selection:text-white flex overflow-hidden relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar />
      </div>

      <main className="flex-1 w-full md:w-auto overflow-y-auto h-screen relative">
         {/* Top Header */}
         <header className="px-4 md:px-8 py-5 border-b border-neutral-800 flex justify-between items-center bg-dark-900 sticky top-0 z-30 shadow-lg shadow-black/50">
            <div className="flex items-center gap-3 md:gap-4">
                {/* Mobile Menu Toggle */}
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden text-red-500 p-1 hover:bg-dark-800 rounded cursor-pointer"
                >
                  {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                <div className="flex items-center gap-2 md:gap-3 text-[10px] font-mono text-red-500 uppercase tracking-[0.2em]">
                    <Terminal size={14} className="text-red-500 hidden md:block" />
                    <span className="opacity-70 hidden sm:inline">ROOT</span>
                    <span className="text-neutral-700 mx-1 hidden sm:inline">/</span> 
                    <span className="truncate max-w-[150px]">{getCurrentSectionTitle()}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-4 md:gap-8">
                <div className="hidden sm:flex items-center gap-3 px-4 py-1.5 bg-dark-700 rounded-full border border-neutral-800">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]"></div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">USER: <span className="text-white font-bold text-red-500">{user?.email?.split('@')[0].toUpperCase()}</span></span>
                </div>
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 hover:text-red-500 transition-colors uppercase tracking-widest group border border-transparent hover:border-red-900/30 px-2 py-1 rounded cursor-pointer"
                >
                    <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" /> <span className="hidden sm:inline">LOGOUT</span>
                </button>
            </div>
         </header>

         {/* Content Area */}
         <div className="p-4 md:p-10 max-w-[1800px] mx-auto pb-20">
            <Routes>
                <Route path="/" element={<DashboardOverview />} />
                <Route path="competitors" element={<AllCompetitors />} />
                <Route path="categories" element={<CategoryManager />} />
                <Route path="logs" element={<SystemLogs />} />
                <Route path="school/:schoolId" element={<SchoolProfile />} />
                <Route path="*" element={<Navigate to="" replace />} />
            </Routes>
         </div>
      </main>
    </div>
  );
};

export default AdminDashboard;