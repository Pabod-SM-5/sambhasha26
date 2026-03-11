import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Lock, User, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate login
    setTimeout(() => {
      if (username.length > 0 && password.length > 0) {
        setLoading(false);
        navigate('/admin/dashboard');
      } else {
        setLoading(false);
        setError('Invalid credentials');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-900/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.4] mix-blend-overlay pointer-events-none" 
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
      />
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-900/10 rounded-full blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#141414] border border-red-900/30 mb-6 shadow-lg shadow-black/50">
            <Shield className="w-6 h-6 text-white/80" />
          </div>
          <h1 className="text-2xl font-medium text-white mb-2">Admin Portal</h1>
          <p className="text-white/40 text-sm">Secure access for administrators only</p>
        </div>

        <div className="bg-[#0a0a0a]/80 border border-red-900/30 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 backdrop-blur-xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-white/40 font-medium ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-3.5 w-4 h-4 text-white/20 group-focus-within:text-white/80 transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#141414]/50 border border-red-900/30 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-900/50 focus:bg-[#141414] transition-all"
                  placeholder="admin_user"
                  autoFocus
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-white/40 font-medium ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-white/20 group-focus-within:text-white/80 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#141414]/50 border border-red-900/30 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-900/50 focus:bg-[#141414] transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-400 text-xs flex items-center gap-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#141414] text-white border border-red-900/30 rounded-xl py-3.5 font-bold uppercase tracking-wider text-xs hover:bg-[#1a1a1a] transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-black/50 hover:shadow-black/70 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Authenticate
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-white/20 uppercase tracking-widest">
              Authorized Personnel Only • ID: NCCUSTUDIOS
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
