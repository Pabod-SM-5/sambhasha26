import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { logSystemAction } from '../lib/logger';
import AuthLayout from './AuthLayout';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // 1. Authenticate User (v2 syntax)
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
          if (authError.message === 'Email not confirmed') {
              throw new Error("Please verify your email address before logging in.");
          }
          if (authError.message.includes('Invalid login credentials')) {
              throw new Error("Invalid email or password.");
          }
          throw authError;
      }

      if (data.user) {
        // 2. Fetch User Profile
        let profile = null;
        let attempts = 0;
        
        while (!profile && attempts < 3) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*') 
              .eq('id', data.user.id)
              .maybeSingle();

            if (!profileError && profileData) {
                profile = profileData;
            } else {
                await new Promise(r => setTimeout(r, 500));
                attempts++;
            }
        }

        if (!profile) {
             console.error("Profile fetch failed after retries.");
             throw new Error("User profile initializing... Please try logging in again in a moment.");
        }

        // 3. Check Deactivation Status
        if (profile.status === 'inactive') {
            await supabase.auth.signOut();
            throw new Error("This account has been deactivated by the Administrator. Please contact the Media Unit.");
        }

        const role = profile?.role || 'user';

        // 4. Log the Login Action
        await logSystemAction('USER_LOGIN', `Successful login for ${role.toUpperCase()}`);

        // 5. Navigate based on Role
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMsg(error.message || 'Failed to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to access the Sambhasha Portal"
      footer={
        <div className="space-y-4">
            <p className="text-sm text-neutral-500">
            Don't have an account? <Link to="/register" className="text-silver-accent hover:text-white font-medium transition-colors cursor-pointer">Register School</Link>
            </p>
            <div className="flex justify-center">
              <span className="text-[10px] text-neutral-600 font-mono">Use your official credentials</span>
            </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Error Message */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-3 flex items-center gap-3 text-red-400 text-xs font-medium animate-in fade-in">
             <AlertCircle size={16} className="flex-shrink-0" />
             {errorMsg}
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-2 group/input">
          <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold ml-1">
            Email Address
          </label>
          <div className="relative">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nalanda.lk"
              className="w-full bg-dark-700/50 border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all duration-300"
              required
            />
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within/input:text-silver-accent transition-colors" />
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2 group/input">
          <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold ml-1">
            Password
          </label>
          <div className="relative">
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-dark-700/50 border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all duration-300 tracking-widest"
              required
            />
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within/input:text-silver-accent transition-colors" />
          </div>
        </div>

        {/* Extras */}
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center space-x-2 cursor-pointer group/check">
            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-silver-accent border-silver-accent' : 'border-neutral-700 bg-transparent group-hover/check:border-neutral-500'}`}>
              {rememberMe && <Check className="w-3 h-3 text-black" strokeWidth={3} />}
              <input 
                type="checkbox" 
                className="hidden"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
            </div>
            <span className="text-neutral-400 group-hover/check:text-neutral-300 transition-colors">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-neutral-500 hover:text-silver-accent transition-colors cursor-pointer">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={isLoading}
          className="w-full group relative overflow-hidden rounded-xl border border-silver-600/60 p-3.5 transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
            <div className="relative z-10 flex items-center justify-center space-x-2">
              <span className="text-xs md:text-sm font-bold tracking-widest text-silver-accent uppercase">
                {isLoading ? 'Authenticating...' : 'Secure Login'}
              </span>
              {!isLoading && <ArrowRight className="w-4 h-4 text-silver-accent group-hover:translate-x-1 transition-transform" />}
            </div>
            {/* Button Glow Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-silver-400/10 to-transparent transition-transform duration-700 ease-in-out" />
        </button>

      </form>
    </AuthLayout>
  );
};

export default LoginScreen;