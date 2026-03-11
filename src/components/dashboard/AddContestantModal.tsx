import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, User, Phone, CreditCard, Trophy, CheckCircle2 } from 'lucide-react';

interface AddContestantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddContestantModal({ isOpen, onClose }: AddContestantModalProps) {
  // Prevent scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-lg bg-[#0a0a0a]/90 backdrop-blur-xl border border-red-900/30 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-red-900/30 flex items-start justify-between bg-[#141414]/50">
                <div>
                  <h2 className="text-lg font-serif font-medium text-white tracking-wide uppercase">
                    Register Contestant
                  </h2>
                  <p className="text-[10px] text-white/40 font-mono mt-1 tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ID Generation Matrix Active
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-white/40 hover:text-white transition-colors p-1 rounded-full hover:bg-zinc-950/5 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar">
                
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
        </>
      )}
    </AnimatePresence>
  );
}
