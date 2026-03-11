import React from 'react';
import { User } from 'lucide-react';

export default function ProfessionalDetails() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 border-b border-red-900/30 pb-2">
        <User className="w-4 h-4 text-zinc-400" />
        <h3 className="text-xs font-medium tracking-widest uppercase text-zinc-200">Professional Details</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1">
              Teacher-in-charge Name
            </label>
            <input 
              type="text" 
              placeholder="Mr./Mrs. Name"
              className="w-full bg-black/50 border border-red-900/20 rounded-lg px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1">
              Coordinator Name
            </label>
            <input 
              type="text" 
              placeholder="Student Name"
              className="w-full bg-black/50 border border-red-900/20 rounded-lg px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1">
              TIC Contact
            </label>
            <input 
              type="tel" 
              placeholder="Mobile Number"
              className="w-full bg-black/50 border border-red-900/20 rounded-lg px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1">
              Coordinator Contact
            </label>
            <input 
              type="tel" 
              placeholder="Mobile Number"
              className="w-full bg-black/50 border border-red-900/20 rounded-lg px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
