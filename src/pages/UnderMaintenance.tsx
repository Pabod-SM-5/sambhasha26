import React from 'react';
import { motion } from 'motion/react';
import { Wrench, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UnderMaintenance() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-50 font-sans selection:bg-red-900/30 selection:text-zinc-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a0a]">
        {/* Soft Matte Gradients */}
        <div className="absolute inset-0 flex opacity-60" style={{ transform: 'skewX(-25deg) scale(1.5) translateX(-10%)' }}>
           <div className="w-[10%] h-full bg-gradient-to-r from-[#ff2a00] to-[#800000] blur-3xl" />
           <div className="w-[20%] h-full bg-gradient-to-r from-[#800000] via-[#cc0000] to-[#0a0a0a] blur-3xl" />
           <div className="w-[15%] h-full bg-[#0a0a0a]" />
           <div className="w-[25%] h-full bg-gradient-to-r from-[#0a0a0a] via-[#ff0000] to-[#0a0a0a] blur-3xl" />
           <div className="w-[10%] h-full bg-[#0a0a0a]" />
           <div className="w-[15%] h-full bg-gradient-to-r from-[#0a0a0a] via-[#cc0000] to-[#800000] blur-3xl" />
           <div className="w-[15%] h-full bg-gradient-to-r from-[#800000] to-[#ff0000] blur-3xl" />
        </div>
        
        {/* Matte Diffuser */}
        <div className="absolute inset-0 bg-[#0a0a0a]/60 backdrop-blur-[80px]" />

        {/* Top/Bottom dark gradients for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent h-[50%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent h-[40%] bottom-0 top-auto" />
        
        {/* Grain Texture */}
        <div 
          className="absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-2xl w-full text-center space-y-8"
      >
        <div className="w-24 h-24 bg-red-900/10 rounded-3xl flex items-center justify-center mx-auto border border-red-900/30 shadow-2xl shadow-black/50 backdrop-blur-xl">
          <Wrench className="w-10 h-10 text-red-500" />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-white">
            Currently in Maintenance
          </h1>
          <p className="text-lg text-white/60 max-w-lg mx-auto leading-relaxed">
            We're making some improvements to our system. 
            For further assistance, please contact us:
          </p>
        </div>

        <div className="flex flex-col gap-3 max-w-md mx-auto pt-4 text-center">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#141414]/50 border border-red-900/30 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-red-900/20 flex items-center justify-center text-red-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Kisara Vonal</p>
              <p className="text-xs text-white/40 uppercase tracking-wider font-mono">President - 0123456789</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#141414]/50 border border-red-900/30 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-red-900/20 flex items-center justify-center text-red-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Yehen Wijewaranakula</p>
              <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Secretary - 0123456789</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#141414]/50 border border-red-900/30 backdrop-blur-sm">
            <div className="w-10 h-10 rounded-lg bg-red-900/20 flex items-center justify-center text-red-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Pabod Sanjuna</p>
              <p className="text-xs text-white/40 uppercase tracking-wider font-mono">Organizer (System Admin) - 0123456789</p>
            </div>
          </div>
        </div>

        <div className="pt-8 text-xs text-white/20 uppercase tracking-widest font-mono">
          System Upgrade in Progress
        </div>
      </motion.div>
    </div>
  );
}
