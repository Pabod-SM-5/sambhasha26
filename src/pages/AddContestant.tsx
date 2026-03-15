import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Phone, CreditCard, Trophy, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function AddContestant() {
  const navigate = useNavigate();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="p-2 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-red-900/30 text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-medium text-zinc-50 tracking-tight">Register Contestant</h1>
          <p className="text-[10px] text-white/40 font-mono mt-1 tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ID Generation Matrix Active
          </p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-red-900/30 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
      >
        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Notice */}
          <div className="p-4 rounded-xl bg-red-900/10 border border-red-900/30">
            <p className="text-xs sm:text-sm text-red-400 font-medium leading-relaxed">
              <strong className="text-red-500">Notice:</strong> You cannot modify your contest entries after submission. Please finalize all details before registering. For further support, contact Admins: Kisara Vonal (0764215114) or Pabod Sanjuna (0776921838).
            </p>
          </div>

          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-white/40 font-mono pl-1">
              Contestant's Name
            </label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Full Name (English)"
                className="w-full bg-[#141414]/50 border border-red-900/30 rounded-lg px-4 py-3 pl-10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/50 transition-all"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/50 transition-colors">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Event Category */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-white/40 font-mono pl-1">
              Event Category
            </label>
            <div className="relative group">
              <select 
                defaultValue=""
                className="w-full bg-[#141414]/50 border border-red-900/30 rounded-lg px-4 py-3 pl-10 text-sm text-white focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/50 transition-all appearance-none cursor-pointer text-white/20 has-[option:checked]:text-white"
              >
                <option value="" disabled hidden>Select Competition Event</option>
                <option value="announcing" className="text-white">Announcing</option>
                <option value="debating" className="text-white">Debating</option>
                <option value="creative_writing" className="text-white">Creative Writing</option>
                <option value="photography" className="text-white">Photography</option>
              </select>
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/50 transition-colors">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-white/40 font-mono pl-1">
              Date of Birth
            </label>
            <div className="relative group">
              <input
                type="date"
                className="w-full bg-[#141414]/50 border border-red-900/30 rounded-lg px-4 py-3 pl-10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/50 transition-all [color-scheme:dark]"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/50 transition-colors">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            
            {/* Age Categories Info */}
            <div className="mt-3 p-3.5 rounded-xl bg-[#141414]/50 border border-white/5">
              <div className="text-[10px] uppercase tracking-wider text-white/40 font-mono mb-2.5 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                Category Birthday Guidelines
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-xs text-white/80 font-medium mb-0.5">Junior</span>
                  <span className="text-[10px] text-white/40 font-mono">Born 2011 - 2013</span>
                </div>
                <div className="flex flex-col p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-xs text-white/80 font-medium mb-0.5">Intermediate</span>
                  <span className="text-[10px] text-white/40 font-mono">Born 2008 - 2010</span>
                </div>
                <div className="flex flex-col p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-xs text-white/80 font-medium mb-0.5">Senior</span>
                  <span className="text-[10px] text-white/40 font-mono">Born 2005 - 2007</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & NIC Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-white/40 font-mono pl-1">
                Contact No
              </label>
              <div className="relative group">
                <input
                  type="tel"
                  placeholder="071 XXXXXXX"
                  className="w-full bg-[#141414]/50 border border-red-900/30 rounded-lg px-4 py-3 pl-10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/50 transition-all"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/50 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-white/40 font-mono pl-1">
                NIC (Optional)
              </label>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="National ID"
                  className="w-full bg-[#141414]/50 border border-red-900/30 rounded-lg px-4 py-3 pl-10 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/50 transition-all"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white/50 transition-colors">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Action */}
        <div className="p-6 pt-2 bg-gradient-to-t from-[#0A0A0A] to-transparent">
          <button className="w-full relative overflow-hidden bg-[#0a0a0a] text-zinc-300 rounded-lg py-3.5 font-bold uppercase tracking-wider text-xs hover:bg-[#141414] hover:text-zinc-100 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer hover:-translate-y-0.5">
            <div 
              className="absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none" 
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
              <span>Confirm Registration</span>
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
