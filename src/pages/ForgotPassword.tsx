import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function ForgotPassword() {
  return (
    <div className="w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <Link to="/" className="inline-flex items-center gap-2 group mb-6">
          <div className="w-10 h-10 bg-zinc-950 rounded-full flex items-center justify-center text-black font-serif font-bold text-xl group-hover:scale-110 transition-transform duration-300">
            S
          </div>
          <span className="font-serif text-2xl tracking-tight text-white/90 group-hover:text-white transition-colors">Sambhasha</span>
        </Link>
        <h1 className="text-2xl font-medium text-white mb-2">Reset Password</h1>
        <p className="text-white/40 text-sm">Security Policy Restriction</p>
      </div>

      <div className="bg-black/60 border border-red-900/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl text-center space-y-6">
        <div className="w-16 h-16 bg-red-900/10 rounded-full flex items-center justify-center mx-auto border border-red-900/30">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Action Not Permitted</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            For security reasons, you cannot reset your password automatically. 
          </p>
          <p className="text-sm text-white/60 leading-relaxed">
            If you need further help, please <a href="https://gravatar.com/sanjunamanohara5" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 transition-colors underline underline-offset-2">contact</a> the system administrator directly.
          </p>
        </div>

        <div className="pt-6 border-t border-red-900/30">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
