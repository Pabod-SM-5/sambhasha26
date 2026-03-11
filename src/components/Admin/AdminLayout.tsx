import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Terminal, 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Shield, 
  Menu, 
  X, 
  Layers, 
  UserCheck, 
  FileText, 
  MoreHorizontal,
  GraduationCap
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/categories', label: 'Categories', icon: Layers },
    { path: '/admin/contestants', label: 'Contestants', icon: UserCheck },
    { path: '/admin/logs', label: 'System Logs', icon: FileText },
    { path: '/admin/other', label: 'Other', icon: MoreHorizontal },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col selection:bg-red-900/30 relative overflow-hidden">
      {/* Background Elements */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.4] mix-blend-overlay pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-900/10 rounded-full blur-[150px]" />
      </div>

      {/* Top Bar */}
      <header className="bg-[#0a0a0a]/80 border-b border-red-900/30 px-4 py-3 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl relative">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden p-1.5 hover:bg-zinc-950/10 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5 text-white/80" /> : <Menu className="w-5 h-5 text-white/80" />}
          </button>

          <div className="w-8 h-8 bg-zinc-950/5 rounded-lg flex items-center justify-center border border-white/10">
            <Terminal className="w-4 h-4 text-white/80" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-white tracking-wider uppercase">Sambhasha Admin</h1>
            <p className="text-[10px] text-white/40">v2.4.1 Stable</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-wider bg-zinc-950/5 px-2 py-1 rounded-full border border-white/5">
            <Shield className="w-3 h-3 text-emerald-500/80" />
            <span>Encrypted</span>
          </div>
          <div className="w-px h-6 bg-zinc-950/10 hidden sm:block" />
          <div className="text-[10px] text-white/40">
            User: <span className="text-white font-medium">NCCUSTUDIOS</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex w-64 flex-col border-r border-red-900/30 bg-[#0a0a0a]/50 backdrop-blur-sm relative z-10">
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 mb-2">
              <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Navigation</p>
            </div>
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${isActive(item.path) ? 'bg-[#141414] text-white border border-red-900/30 shadow-lg shadow-black/50' : 'text-zinc-400 hover:text-white hover:bg-[#141414]/50'}`}
              >
                <item.icon className={`w-4 h-4 ${isActive(item.path) ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <Link 
              to="/admin" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Link>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 w-64 bg-[#0a0a0a]/90 backdrop-blur-xl border-r border-red-900/30 z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-950/5 rounded-lg flex items-center justify-center border border-white/10">
                <Terminal className="w-4 h-4 text-white/80" />
              </div>
              <span className="text-xs font-bold text-white tracking-wider uppercase">Menu</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-1.5 hover:bg-zinc-950/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${isActive(item.path) ? 'bg-[#141414] text-white border border-red-900/30 shadow-lg shadow-black/50' : 'text-zinc-400 hover:text-white hover:bg-[#141414]/50'}`}
              >
                <item.icon className={`w-4 h-4 ${isActive(item.path) ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <Link 
              to="/admin" 
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
