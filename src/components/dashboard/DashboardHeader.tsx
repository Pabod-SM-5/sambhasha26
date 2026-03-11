import React from 'react';
import { Plus, FileSpreadsheet, Upload, Map } from 'lucide-react';

interface DashboardHeaderProps {
  onAddContestant: () => void;
}

export default function DashboardHeader({ onAddContestant }: DashboardHeaderProps) {
  const handleViewMap = () => {
    alert("Map will enable to show from 5.00 a.m. of 6th of June. ( competition day )");
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-serif font-medium text-zinc-50 tracking-tight">Dashboard</h1>
        <p className="text-zinc-400 text-sm mt-1">Manage and view contestant registrations</p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleViewMap}
            className="px-4 py-2 relative overflow-hidden bg-[#0a0a0a] text-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 hover:bg-[#141414] hover:text-zinc-100 cursor-pointer hover:-translate-y-0.5"
            title="Map will enable to show from 5.00 a.m. of 6th of June. ( competition day )"
          >
            <div 
              className="absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none" 
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <Map className="w-4 h-4" />
              View Map
            </span>
          </button>
          <button 
            onClick={onAddContestant}
            className="px-4 py-2 relative overflow-hidden bg-[#0a0a0a] text-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 hover:bg-[#141414] hover:text-zinc-100 cursor-pointer hover:-translate-y-0.5"
          >
            <div 
              className="absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none" 
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Contestant
            </span>
          </button>
          <button className="px-4 py-2 relative overflow-hidden bg-[#0a0a0a] text-zinc-300 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-2 hover:bg-[#141414] hover:text-zinc-100 cursor-pointer hover:-translate-y-0.5">
            <div 
              className="absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none" 
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Download Excel Format
            </span>
          </button>
          <button className="px-4 py-2 relative overflow-hidden bg-[#0a0a0a] text-zinc-300 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-2 hover:bg-[#141414] hover:text-zinc-100 cursor-pointer hover:-translate-y-0.5">
            <div 
              className="absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none" 
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Bulk Upload
            </span>
          </button>
      </div>
    </div>
  );
}
