import React from 'react';
import { Lock, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'motion/react';

interface AccountSecurityProps {
  password: string;
  setPassword: (password: string) => void;
  strength: number;
}

export default function AccountSecurity({ password, setPassword, strength }: AccountSecurityProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 border-b border-red-900/30 pb-2">
        <Lock className="w-4 h-4 text-zinc-400" />
        <h3 className="text-xs font-medium tracking-widest uppercase text-zinc-200">Account Security</h3>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1">
            Email
          </label>
          <input 
            type="email" 
            placeholder="mediaunit@school.lk"
            className="w-full bg-black/50 border border-red-900/20 rounded-lg px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300"
          />
        </div>

        {/* Password Strength Meter */}
        <div className="space-y-2 pt-2">
           <div className="flex justify-between items-center">
              <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1 flex items-center gap-2">
                 <Lock className="w-3 h-3" /> Password Strength
              </label>
              <span className="text-[10px] font-mono text-zinc-400">{strength}%</span>
           </div>
           <div className="h-1 w-full bg-black/50 border border-red-900/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-red-600"
                initial={{ width: 0 }}
                animate={{ width: `${strength}%` }}
                transition={{ duration: 0.3 }}
              />
           </div>
           
           <div className="bg-black/40 border border-red-900/20 rounded-lg p-3 space-y-2">
              {[
                { label: "At least 12 characters", met: password.length >= 12 },
                { label: "At least 1 uppercase letter", met: /[A-Z]/.test(password) },
                { label: "At least 1 number", met: /[0-9]/.test(password) },
                { label: "At least 1 special character (!@#$%^&*)", met: /[^A-Za-z0-9]/.test(password) },
              ].map((req, i) => (
                <div key={i} className="flex items-center space-x-2">
                  {req.met ? (
                    <CheckCircle2 className="w-3 h-3 text-red-500" />
                  ) : (
                    <Circle className="w-3 h-3 text-zinc-600" />
                  )}
                  <span className={`text-[10px] ${req.met ? 'text-zinc-300' : 'text-zinc-500'}`}>{req.label}</span>
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1">
              Password
            </label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-black/50 border border-red-900/20 rounded-lg px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 tracking-widest"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1">
              Confirm Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-black/50 border border-red-900/20 rounded-lg px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300 tracking-widest"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
