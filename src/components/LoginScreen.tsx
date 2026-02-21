import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { setRememberMePreference } from '../lib/customStorageAdapter';
import { logSystemAction } from '../lib/logger';
import AuthLayout from './AuthLayout';
import { validateEmail } from '../lib/validators';
import { rateLimiter, rateLimits } from '../lib/rateLimiter';
import { retryWithBackoff, retryConfigs } from '../lib/exponentialBackoff';
import { secureLogger } from '../lib/secureLogs';

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
      // ========== SECURITY: RATE LIMITING ==========
      const rateLimit = rateLimits.login(email);
      if (!rateLimiter.isAllowed(rateLimit.key, rateLimit.maxAttempts, rateLimit.windowMs)) {
        const secondsRemaining = rateLimiter.getSecondsUntilReset(rateLimit.key);
        setErrorMsg(`Too many login attempts. Please try again in ${secondsRemaining} seconds.`);
        secureLogger.warn('Login rate limit exceeded', { email });
        setIsLoading(false);
        return;
      }

      // ========== VALIDATION: EMAIL FORMAT ==========
      const emailValidation = validateEmail(email);
      if (!emailValidation.valid) {
        setErrorMsg(emailValidation.error || 'Please enter a valid email address');
        setIsLoading(false);
        return;
      }

      // ========== AUTHENTICATION: PERSISTENCE & SIGN IN ==========
      // Save user preference for the custom adapter to read during login
      setRememberMePreference(rememberMe);

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
          // Generic error messages to prevent information disclosure
          if (authError.message === 'Email not confirmed') {
              setErrorMsg("Please verify your email address before logging in.");
          } else if (authError.message.includes('Invalid login credentials')) {
              setErrorMsg("Invalid credentials. Please check your email and password.");
              secureLogger.warn('Failed login attempt - invalid credentials', { email });
          } else {
              setErrorMsg("Login failed. Please try again or contact support.");
              secureLogger.error('Login authentication error', { status: authError.status, error: authError });
          }
          setIsLoading(false);
          return;
      }

      if (data.user) {
        // ========== FETCH PROFILE WITH EXPONENTIAL BACKOFF ==========
        let profile = null;
        try {
          profile = await retryWithBackoff(
            async () => {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*') 
                .eq('id', data.user.id)
                .maybeSingle();

              if (profileError) throw profileError;
              if (!profileData) throw new Error('Profile not found');
              return profileData;
            },
            {
              ...retryConfigs.profileFetch,
              onRetry: (attempt, delay, error) => {
                secureLogger.debug(`Retrying profile fetch - attempt ${attempt}, waiting ${delay}ms`);
              }
            }
          );
        } catch (err: any) {
          // සැබෑ දෝෂය logger එක වෙත යැවීම
          secureLogger.error('Profile fetch failed after retries', { error: err?.message || err });
          setErrorMsg("Unable to load your profile. Please try logging in again.");
          await supabase.auth.signOut();
          setIsLoading(false);
          return;
        }

        // ========== CHECK ACCOUNT STATUS ==========
        if (profile.status === 'inactive') {
            await supabase.auth.signOut();
            setErrorMsg("Your account has been deactivated. Please contact the Media Unit for assistance.");
            secureLogger.warn('Login attempted with deactivated account', { email, userId: data.user.id });
            setIsLoading(false);
            return;
        }

        const role = profile?.role || 'user';

        // ========== LOGGING: SUCCESSFUL LOGIN ==========
        await logSystemAction('USER_LOGIN', `Successful login for ${role.toUpperCase()}`);
        secureLogger.info('User logged in successfully', { userId: data.user.id, role });

        // ========== NAVIGATION: ROLE-BASED REDIRECT ==========
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      }
    } catch (error: any) {
      // 'undefined' error එක වළක්වා සැබෑ දෝෂය log කිරීම
      secureLogger.error('Unexpected login error', { 
        errorMessage: error?.message || 'Unknown error',
        fullError: error 
      }); 
      
      // සැබෑ දෝෂය (Actual Exception) browser console එකේ ක්ෂණිකව බලා ගැනීමට
      console.error("Actual Exception caught in LoginScreen:", error); 

      setErrorMsg('An unexpected error occurred. Please try again.');
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