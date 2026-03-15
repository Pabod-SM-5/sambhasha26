import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Settings, User, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-50 font-sans selection:bg-red-900/30 selection:text-zinc-50 flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a0a]">
        {/* Soft Matte Gradients */}
        <div className="absolute inset-0 flex opacity-60" style={{ transform: 'skewX(-25deg) scale(1.5) translateX(-10%)' }}>
           <div className="w-[10%] h-full bg-gradient-to-r from-[#ff2a00] to-[#800000] blur-3xl" />
           <div className="w-[20%] h-full bg-gradient-to-r from-[#800000] via-[#cc0000] to-[#0a0a0a] blur-3xl" />
           <div className="w-[15%] h-full bg-[#0a0a0a]" />
           <div className="w-[25%] h-full bg-gradient-to-r from-[#0a0a0a] via-[#ff0000] to-[#0a0a0a] blur-3xl" />
           <div className="w-[10%] h-full bg-[#0a0a0a]" />
           <div className="w-[15%] h-full bg-gradient-to-r from-[#0a0a0a] via-[#cc0000] to-[#800000] blur-3xl" />
           <div className="w-[15%] h-full bg-gradient-to-r from-[#800000] to-[#ff0000] blur-3xl" />
        </div>
        
        {/* Matte Diffuser */}
        <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-[80px]" />

        {/* Top/Bottom dark gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent h-[50%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent h-[40%] bottom-0 top-auto" />
        
        {/* Grain Texture */}
        <div 
          className="absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-red-900/30 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <div className="flex-shrink-0 flex items-center gap-3">
              <img 
                src="https://zlehpcmytcixupbhahtl.supabase.co/storage/v1/object/sign/logo/logo-removebg-preview.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zZGRkN2NkNy01MDBjLTQ1ZjQtOTNkYi02M2UzYzVhNGVkMjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL2xvZ28tcmVtb3ZlYmctcHJldmlldy5wbmciLCJpYXQiOjE3NzI4NjIyNDYsImV4cCI6MTgwNDM5ODI0Nn0.FRr7wks9SC7vaKR3qUaSEqJIOiSMU88naybXFkQxidQ" 
                alt="Sambhasha Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>

            {/* Middle: Nav Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { name: 'Dashboard', path: '/dashboard' },
                { name: 'Categories', path: '/categories' },
                { name: 'Rules & Regulations', path: '/rules' },
                { name: 'Submissions', path: '/submissions' },
              ].map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 outline-none focus:outline-none ${
                      isActive
                        ? 'bg-[#141414] text-zinc-50 border border-red-900/30'
                        : 'text-zinc-400 hover:text-zinc-50 hover:bg-[#141414] border border-transparent'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>

            {/* Right: Settings & Profile (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <NavLink 
                to="/settings"
                className={({ isActive }) => 
                  `p-2 rounded-full transition-colors cursor-pointer outline-none focus:outline-none ${isActive ? 'text-zinc-50 bg-[#141414]' : 'text-zinc-400 hover:text-zinc-50 hover:bg-[#141414]'}`
                }
              >
                <Settings className="w-5 h-5" />
              </NavLink>
              
              <button className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-colors cursor-pointer" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>

              <div className="h-6 w-[1px] bg-zinc-800 mx-1"></div>
              <div className="flex items-center gap-3 pl-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 p-[1px]">
                   <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                      <User className="w-4 h-4 text-zinc-400" />
                   </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-zinc-400 hover:text-zinc-50 hover:bg-[#141414] rounded-lg transition-colors cursor-pointer"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Dropdown) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-red-900/30 bg-[#0a0a0a] overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-1">
                {[
                  { name: 'Dashboard', path: '/dashboard' },
                  { name: 'Categories', path: '/categories' },
                  { name: 'Rules & Regulations', path: '/rules' },
                  { name: 'Submissions', path: '/submissions' },
                ].map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 outline-none focus:outline-none ${
                        isActive
                          ? 'bg-[#141414] text-zinc-50 border border-red-900/30'
                          : 'text-zinc-400 hover:text-zinc-50 hover:bg-[#141414] border border-transparent'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                
                {/* Mobile Settings & Profile */}
                <div className="pt-4 mt-4 border-t border-red-900/30 flex items-center justify-between px-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 p-[1px]">
                       <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                          <User className="w-4 h-4 text-zinc-400" />
                       </div>
                    </div>
                    <span className="text-sm font-medium text-zinc-300">Profile</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <NavLink 
                      to="/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) => 
                        `p-2 rounded-full transition-colors cursor-pointer outline-none focus:outline-none ${isActive ? 'text-zinc-50 bg-[#141414]' : 'text-zinc-400 hover:text-zinc-50 hover:bg-[#141414]'}`
                      }
                    >
                      <Settings className="w-5 h-5" />
                    </NavLink>
                    <button className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 rounded-full transition-colors cursor-pointer">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8 relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-red-900/30 bg-[#0a0a0a]/80 backdrop-blur-xl py-6 relative z-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <p className="text-xs text-white/40 font-mono tracking-wider">
            &copy; 2026 NCCUSTUDIOS . all right reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
