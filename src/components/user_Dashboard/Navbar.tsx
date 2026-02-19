import React, { useState } from 'react';
import { Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

interface NavbarProps {
  onOpenSettings: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenSettings, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { profile, user } = useAuth();
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const schoolName = profile?.school_name || 'School Portal';
  const email = user?.email || '';
  const avatarUrl = profile?.logo_url;

  // Helper to check active path
  const isActive = (path: string) => {
    // Exact match for dashboard root
    if (path === '/user') {
        return location.pathname === '/user' || location.pathname === '/user/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-dark-950/80 backdrop-blur-md">
      <div className="w-1/4">
        <img 
          src={logo} 
          alt="SAMBHASHA XXVI" 
          className="h-10 md:h-12 w-auto object-contain"
        />
      </div>
      
      <nav className="hidden md:flex flex-1 justify-center space-x-10">
        <button 
            onClick={() => navigate('/user')}
            className={`relative font-medium text-sm tracking-widest uppercase transition-colors cursor-pointer pb-1 ${
                isActive('/user') 
                ? "text-silver-accent font-semibold after:content-[''] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-0.5 after:bg-silver-accent" 
                : "text-neutral-500 hover:text-neutral-300"
            }`}
        >
          Dashboard
        </button>
        <button 
            onClick={() => navigate('/user/categories')}
            className={`relative font-medium text-sm tracking-widest uppercase transition-colors cursor-pointer pb-1 ${
                isActive('/user/categories') 
                ? "text-silver-accent font-semibold after:content-[''] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-0.5 after:bg-silver-accent" 
                : "text-neutral-500 hover:text-neutral-300"
            }`}
        >
          Categories
        </button>
        <button className="text-neutral-500 hover:text-neutral-300 font-medium text-sm tracking-widest uppercase transition-colors cursor-pointer opacity-50 cursor-not-allowed" title="Coming Soon">
          Rules and Regulations
        </button>
      </nav>

      <div className="w-1/4 flex justify-end items-center space-x-6">
        <button 
          onClick={onOpenSettings}
          className="text-neutral-400 hover:text-white transition-colors p-1 cursor-pointer"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-9 h-9 rounded-full bg-dark-800 hover:bg-dark-700 border border-neutral-700 transition-colors flex items-center justify-center overflow-hidden focus:ring-2 focus:ring-silver-500/50 cursor-pointer p-0"
          >
            {avatarUrl && !imgError ? (
                <img 
                  src={avatarUrl} 
                  alt="School Logo" 
                  className="w-full h-full object-cover" 
                  onError={() => setImgError(true)}
                />
            ) : (
                <User size={16} className="text-neutral-400" />
            )}
          </button>

          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-3 w-48 bg-dark-card border border-neutral-800 rounded-xl shadow-2xl py-2 z-50 animate-zoom-in-95">
                <div className="px-4 py-2 border-b border-neutral-800 mb-1">
                  <p className="text-xs text-white font-semibold truncate">{schoolName}</p>
                  <p className="text-[10px] text-neutral-500 truncate">{email}</p>
                </div>
                <button 
                  onClick={onLogout}
                  className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 flex items-center space-x-2 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;