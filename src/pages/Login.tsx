import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Mail, Lock } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="text-center mb-8">
        <Link to="/" className="inline-block mb-6 group">
          <img 
            src="https://zlehpcmytcixupbhahtl.supabase.co/storage/v1/object/sign/logo/NCCU%20Bottom%20English.PNG?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zZGRkN2NkNy01MDBjLTQ1ZjQtOTNkYi02M2UzYzVhNGVkMjUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dvL05DQ1UgQm90dG9tIEVuZ2xpc2guUE5HIiwiaWF0IjoxNzczMjQ5MTA3LCJleHAiOjE4MDQ3ODUxMDd9.eVacVEjbxF51wpA-bRS-aFWfE3zG9If1JR4xHVbW7e8" 
            alt="NCCU Logo" 
            className="w-24 h-auto md:w-32 object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <h1 className="text-2xl font-medium text-zinc-50 mb-2">Welcome Back</h1>
        <p className="text-zinc-400 text-sm">Sign in to your account to continue</p>
      </div>

      <div className="bg-black/60 border border-red-900/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xl">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400 group-focus-within:text-white transition-all" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-red-900/20 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-red-900/50 focus:bg-black/80 transition-all"
                placeholder="name@school.lk"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Password</label>
              <Link to="/forgot-password" className="text-xs text-zinc-400 hover:text-zinc-50 transition-colors">Forgot password?</Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400 group-focus-within:text-white transition-all" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-red-900/20 rounded-xl py-3 pl-10 pr-4 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-red-900/50 focus:bg-black/80 transition-all"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden bg-[#0a0a0a] text-zinc-300 rounded-xl py-3 sm:py-3.5 font-bold uppercase tracking-wider text-[10px] sm:text-xs hover:bg-[#141414] hover:text-zinc-100 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div 
              className="absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none" 
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <span className="w-4 h-4 border-2 border-zinc-500/30 border-t-zinc-300 rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </span>
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-red-900/30 text-center">
          <p className="text-sm text-zinc-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-zinc-50 hover:underline decoration-red-500/50 underline-offset-4 transition-all">
              Register your school
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
