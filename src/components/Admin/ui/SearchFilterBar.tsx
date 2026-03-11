import React from 'react';
import { Search } from 'lucide-react';
import ModernDropdown from '../../ui/ModernDropdown';

interface SearchFilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  filterOptions: string[];
  searchPlaceholder?: string;
  filterLabel?: string;
}

export default function SearchFilterBar({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  filterOptions,
  searchPlaceholder = 'Search...',
  filterLabel = 'Filter'
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-[#0a0a0a]/80 backdrop-blur-md p-4 rounded-2xl border border-red-900/30">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input 
          type="text" 
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#141414]/50 border border-red-900/30 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-red-900/50 transition-colors"
        />
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
        <div className="relative min-w-[180px]">
          <ModernDropdown 
            options={filterOptions}
            value={selectedFilter}
            onChange={setSelectedFilter}
            label={filterLabel}
            placeholder={`Select ${filterLabel}`}
          />
        </div>
      </div>
    </div>
  );
}
