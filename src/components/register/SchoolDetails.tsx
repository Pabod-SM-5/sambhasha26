import React from 'react';
import { Building2 } from 'lucide-react';

export default function SchoolDetails() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 border-b border-red-900/30 pb-2">
        <Building2 className="w-4 h-4 text-zinc-400" />
        <h3 className="text-xs font-medium tracking-widest uppercase text-zinc-200">School Details</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1">
            School Name
          </label>
          <input 
            type="text" 
            placeholder="e.g. Nalanda College"
            className="w-full bg-black/50 border border-red-900/20 rounded-lg px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1">
              District
            </label>
            <input 
              type="text" 
              placeholder="e.g. Colombo"
              className="w-full bg-black/50 border border-red-900/20 rounded-lg px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1">
              Official Phone
            </label>
            <input 
              type="tel" 
              placeholder="011 2 123 456"
              className="w-full bg-black/50 border border-red-900/20 rounded-lg px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono pl-1">
            Address
          </label>
          <input 
            type="text" 
            placeholder="School Address"
            className="w-full bg-black/50 border border-red-900/20 rounded-lg px-4 py-3 text-sm text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-300"
          />
        </div>
      </div>
    </div>
  );
}
