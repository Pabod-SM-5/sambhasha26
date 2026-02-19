import React, { useState } from 'react';
import { Mail, ArrowRight, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AuthLayout from './AuthLayout';

const ForgotPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const redirectTo = `${window.location.origin}/update-password`;
      
      // v2 syntax: auth.resetPasswordForEmail
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      });

      if (error) throw error;

      setStatus({
        type: 'success',
        text: 'Password reset link has been sent to your email.'
      });
      setEmail(''); 

    } catch (error: any) {
      console.error('Reset error:', error);
      setStatus({
        type: 'error',
        text: error.message || 'Failed to send reset email.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Recover Account"
      subtitle="Enter your official email to reset password"
      maxWidth="max-w-md"
      footer={
        <Link to="/login" className="inline-flex items-center text-xs text-neutral-500 hover:text-white transition-colors gap-2 cursor-pointer group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Status Message */}
        {status && (
          <div className={`border rounded-xl p-4 flex items-start gap-3 text-xs font-medium animate-in fade-in ${
            status.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-green-500/10 border-green-500/50 text-green-400'
          }`}>
             {status.type === 'error' ? <AlertCircle size={16} className="mt-0.5" /> : <CheckCircle size={16} className="mt-0.5" />}
             <div className="leading-relaxed">{status.text}</div>
          </div>
        )}

        <div className="space-y-2 group/input">
          <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold ml-1">
            Official Email
          </label>
          <div className="relative">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mediaunit@school.lk"
              className="w-full bg-dark-700/50 border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all duration-300"
              required
            />
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within/input:text-silver-accent transition-colors" />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full group relative overflow-hidden rounded-xl border border-silver-600/60 p-3.5 transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
            <div className="relative z-10 flex items-center justify-center space-x-2">
              <span className="text-xs md:text-sm font-bold tracking-widest text-silver-accent uppercase">
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </span>
              {!isLoading && <ArrowRight className="w-4 h-4 text-silver-accent group-hover:translate-x-1 transition-transform" />}
            </div>
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-silver-400/10 to-transparent transition-transform duration-700 ease-in-out" />
        </button>

      </form>
    </AuthLayout>
  );
};

export default ForgotPasswordScreen;