import React from 'react';
import { LayoutDashboard, Layers, FileText, AlertTriangle, ChevronRight, Users } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', path: '/admin', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'competitors', path: '/admin/competitors', label: 'COMPETITORS', icon: Users },
    { id: 'categories', path: '/admin/categories', label: 'CATEGORY_MGR', icon: Layers },
    { id: 'logs', path: '/admin/logs', label: 'SYSTEM_LOGS', icon: FileText },
  ];

  // Logic to determine if a menu item is active
  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 h-full min-h-screen bg-dark-900 border-r border-neutral-900 flex flex-col shadow-2xl md:shadow-none">
      {/* Header */}
      <div className="p-8 pb-12">
        <h3 className="text-[10px] font-mono text-red-500 tracking-[0.2em] mb-2 opacity-80">NCCU ADMIN</h3>
        <h1 className="text-2xl font-serif text-white tracking-wider font-bold">SAMBHASHA</h1>
        <div className="h-[1px] w-12 bg-red-600 mt-4 shadow-[0_0_10px_#dc2626]"></div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center justify-between px-4 py-4 text-xs font-mono tracking-widest transition-all duration-300 border-l-2 group cursor-pointer ${
              isActive(item.path)
                ? 'bg-red-900/10 text-red-500 border-red-500 shadow-[inset_10px_0_20px_-10px_rgba(220,38,38,0.1)]' 
                : 'text-neutral-500 hover:text-red-400 hover:bg-dark-800 border-transparent hover:border-red-500/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <item.icon size={18} strokeWidth={1.5} className={isActive(item.path) ? "text-red-500 drop-shadow-[0_0_3px_rgba(239,68,68,0.5)]" : "text-neutral-600 group-hover:text-red-500 transition-colors"} />
              <span>{item.label}</span>
            </div>
            {isActive(item.path) && <ChevronRight size={14} className="text-red-500" />}
          </button>
        ))}
      </nav>

      {/* Footer / Status */}
      <div className="p-6">
        <div className="border border-red-900/30 bg-red-950/10 p-4 flex items-center gap-3 rounded-sm shadow-[0_0_15px_rgba(220,38,38,0.1)] animate-pulse-slow">
            <AlertTriangle size={16} className="text-red-600" />
            <span className="text-[10px] text-red-500 font-mono tracking-[0.2em] font-bold">ADMIN_MODE</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;