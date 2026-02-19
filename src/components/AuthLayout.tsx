import React from 'react';
import logo from './../assets/ncculogo.png';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footer?: React.ReactNode;
  maxWidth?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  footer, 
  maxWidth = "max-w-md" 
}) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-1">
      {/* Background Ambient Glow */}
      <div className="fixed top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-silver-400/10 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className={`z-10 w-full ${maxWidth} flex flex-col items-center animate-in fade-in zoom-in duration-500`}>
        
        {/* Common Header Section */}
        <div className="text-center mb-10 flex flex-col items-center">
          <img 
            src={logo} 
            alt="SAMBHASHA XXVI" 
            className="h-20 md:h-40 w-auto object-contain "
          />
          
          <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">{title}</h2>
          <p className="text-sm text-neutral-500">{subtitle}</p>
        </div>

        {/* Main Content Card */}
        <div className="w-full bg-dark-card border border-neutral-800/60 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-sm relative overflow-hidden">
            
            {/* Subtle top gradient line on card */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-silver-400/50 to-transparent opacity-50" />

            {children}
        </div>

        {/* Footer Section */}
        {footer && (
          <div className="mt-8 text-center space-y-4">
            {footer}
            <p className="text-[10px] text-neutral-600 tracking-widest uppercase">
              © 2026 NCCU • Secure System
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default AuthLayout;