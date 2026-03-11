import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

export default function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname === '/register';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-50 font-sans selection:bg-red-900/30 selection:text-zinc-50 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
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

      <div className="w-full max-w-7xl z-10 flex flex-col items-center">
        {/* Main Content Area */}
        <div className="w-full flex flex-col items-center">
          <Outlet />
        </div>

        {/* Footer */}
        <div className="mt-8 sm:mt-12 text-center space-y-4">
          <p className="text-[10px] text-zinc-400 tracking-wider uppercase font-mono">
            © 2026 NCCUSTUDIOS • SECURE SYSTEM
          </p>
        </div>
      </div>
    </div>
  );
}
