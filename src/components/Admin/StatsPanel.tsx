import React from 'react';
import { Users, Trophy } from 'lucide-react';

export default function StatsPanel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      {/* Stat Card 1 */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl p-6 relative overflow-hidden group hover:border-red-900/50 transition-all shadow-lg shadow-black/50">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Users className="w-16 h-16 text-white" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <h3 className="text-xs uppercase tracking-wider text-white/40 font-medium">Total Schools</h3>
        </div>
        <div className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-2">
          142
        </div>
        <div className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] text-emerald-400 font-medium">
          +12 this week
        </div>
      </div>

      {/* Stat Card 2 */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl p-6 relative overflow-hidden group hover:border-red-900/50 transition-all shadow-lg shadow-black/50">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <Trophy className="w-16 h-16 text-white" />
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <h3 className="text-xs uppercase tracking-wider text-white/40 font-medium">Contest Entries</h3>
        </div>
        <div className="text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-2">
          856
        </div>
        <div className="inline-flex items-center px-2 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-medium">
          Across 5 categories
        </div>
      </div>
    </div>
  );
}
