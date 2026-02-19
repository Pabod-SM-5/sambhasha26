import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AuthLayout from './AuthLayout';

const UpdatePasswordScreen: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    if (password !== confirmPassword) {
        setStatus({ type: 'error', text: "Passwords do not match." });
        setIsLoading(false);
        return;
    }

    if (password.length < 6) {
        setStatus({ type: 'error', text: "Password must be at least 6 characters." });
        setIsLoading(false);
        return;
    }

    try {
      // v2 syntax: auth.updateUser({ password })
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setStatus({
        type: 'success',
        text: 'Password updated successfully. Redirecting...'
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error: any) {
      console.error('Update error:', error);
      setStatus({
        type: 'error',
        text: error.message || 'Failed to update password.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set New Password"
      subtitle="Secure your account with a new credential"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {status && (
          <div className={`border rounded-xl p-4 flex items-start gap-3 text-xs font-medium animate-in fade-in ${
            status.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-green-500/10 border-green-500/50 text-green-400'
          }`}>
             {status.type === 'error' ? <AlertCircle size={16} className="mt-0.5" /> : <CheckCircle size={16} className="mt-0.5" />}
             <div className="leading-relaxed">{status.text}</div>
          </div>
        )}

        <div className="space-y-4">
            <div className="space-y-2 group/input">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold ml-1">
                New Password
            </label>
            <div className="relative">
                <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-dark-700/50 border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all duration-300"
                required
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within/input:text-silver-accent transition-colors" />
            </div>
            </div>

            <div className="space-y-2 group/input">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold ml-1">
                Confirm Password
            </label>
            <div className="relative">
                <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-dark-700/50 border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all duration-300"
                required
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within/input:text-silver-accent transition-colors" />
            </div>
            </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full group relative overflow-hidden rounded-xl border border-silver-600/60 p-3.5 transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
            <div className="relative z-10 flex items-center justify-center space-x-2">
              <span className="text-xs md:text-sm font-bold tracking-widest text-silver-accent uppercase">
                {isLoading ? 'Updating...' : 'Update Password'}
              </span>
              {!isLoading && <ArrowRight className="w-4 h-4 text-silver-accent group-hover:translate-x-1 transition-transform" />}
            </div>
        </button>

      </form>
    </AuthLayout>
  );
};

export default UpdatePasswordScreen;