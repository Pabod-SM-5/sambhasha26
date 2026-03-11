import React from 'react';
import { User, Phone } from 'lucide-react';

interface CoordinatorDetailsFormProps {
  schoolDetails: {
    coordinatorName: string;
    coordinatorMobile: string;
  };
}

export default function CoordinatorDetailsForm({ schoolDetails }: CoordinatorDetailsFormProps) {
  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <User className="w-5 h-5 text-white/60" />
        <h3 className="text-sm font-bold uppercase tracking-wider text-white/80">Co-ordinator Details</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-white/30 font-mono pl-1">Full Name</label>
          <div className="bg-[#141414]/50 border border-red-900/30 rounded-lg px-4 py-3 text-sm text-white/50 cursor-not-allowed flex items-center gap-3">
            <User className="w-4 h-4 text-white/20" />
            {schoolDetails.coordinatorName}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-white/30 font-mono pl-1">Mobile Number</label>
          <div className="bg-[#141414]/50 border border-red-900/30 rounded-lg px-4 py-3 text-sm text-white/50 cursor-not-allowed flex items-center gap-3">
            <Phone className="w-4 h-4 text-white/20" />
            {schoolDetails.coordinatorMobile}
          </div>
        </div>
      </div>
    </div>
  );
}
