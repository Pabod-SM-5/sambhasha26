import React from 'react';
import { Phone, UserCheck } from 'lucide-react';

export default function ContactInfo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl p-6 flex items-center justify-between group hover:border-red-900/50 transition-all duration-300">
        <div className="space-y-1">
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Coordinator</p>
          <h3 className="text-lg font-medium text-white">Hiruna Alpitiya</h3>
          <p className="text-white/60 font-mono text-sm flex items-center gap-2">
            <Phone className="w-3 h-3" /> 071 081 6023
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center group-hover:bg-[#1a1a1a] transition-colors border border-red-900/30 group-hover:border-red-900/50">
          <UserCheck className="w-5 h-5 text-white/60" />
        </div>
      </div>

      <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl p-6 flex items-center justify-between group hover:border-red-900/50 transition-all duration-300">
        <div className="space-y-1">
          <p className="text-[10px] text-white/40 uppercase tracking-wider font-mono">Coordinator</p>
          <h3 className="text-lg font-medium text-white">Ramin Asmika</h3>
          <p className="text-white/60 font-mono text-sm flex items-center gap-2">
            <Phone className="w-3 h-3" /> 071 425 3596
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#141414] flex items-center justify-center group-hover:bg-[#1a1a1a] transition-colors border border-red-900/30 group-hover:border-red-900/50">
          <UserCheck className="w-5 h-5 text-white/60" />
        </div>
      </div>
    </div>
  );
}
