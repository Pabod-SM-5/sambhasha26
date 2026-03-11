import React from 'react';
import { motion } from 'motion/react';
import { Lock, Shield, AlertTriangle, Mail } from 'lucide-react';

interface ProfileCardProps {
  schoolDetails: {
    name: string;
    district: string;
    logoUrl: string;
  };
}

export default function ProfileCard({ schoolDetails }: ProfileCardProps) {
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl p-6 flex flex-col items-center text-center space-y-4 shadow-xl shadow-black/50"
      >
        <div className="relative group">
          <div className="w-32 h-32 rounded-full bg-[#141414] border-2 border-red-900/30 p-4 flex items-center justify-center overflow-hidden">
            <img 
              src={schoolDetails.logoUrl} 
              alt="School Logo" 
              className="w-full h-full object-contain opacity-80 grayscale group-hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Lock className="w-6 h-6 text-white/60" />
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-medium text-white">{schoolDetails.name}</h2>
          <p className="text-white/40 text-xs font-mono mt-1 uppercase tracking-wider">{schoolDetails.district}</p>
        </div>

        <div className="w-full pt-4 border-t border-white/5">
          <div className="flex items-center justify-center gap-2 text-xs text-white/30 bg-zinc-950/[0.02] py-2 rounded-lg">
            <Shield className="w-3 h-3" />
            <span>Verified Official Account</span>
          </div>
        </div>
      </motion.div>

      {/* Security Notice Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6 space-y-4"
      >
        <div className="flex items-center gap-3 text-red-400">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-sm font-bold uppercase tracking-wider">Security Notice</h3>
        </div>
        <p className="text-xs text-red-200/60 leading-relaxed">
          For security reasons, you cannot directly modify your school's registration details or profile image.
        </p>
        <div className="text-xs text-white/40 pt-2 border-t border-white/5">
          <p className="mb-2">To request changes or recover password:</p>
          <a href="mailto:support@sambhasha.lk" className="text-white hover:underline decoration-white/30 underline-offset-4 flex items-center gap-2 transition-all">
            <Mail className="w-3 h-3" />
            Contact Organizing Committee
          </a>
        </div>
      </motion.div>
    </div>
  );
}
