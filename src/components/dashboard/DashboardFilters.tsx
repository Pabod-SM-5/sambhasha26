import React from 'react';
import { Search } from 'lucide-react';
import ModernDropdown from '../ui/ModernDropdown';

interface DashboardFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

export default function DashboardFilters({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory, 
  categories 
}: DashboardFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
      {/* Search Bar */}
      <div className="md:col-span-8 relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-zinc-400 group-focus-within:text-zinc-300 transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2.5 border border-red-900/30 rounded-xl leading-5 bg-[#0a0a0a]/80 backdrop-blur-md text-zinc-50 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-red-900/50 focus:border-red-900/50 sm:text-sm transition-all duration-200"
          placeholder="Search by name, ID, or NIC..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div className="md:col-span-4 relative">
        <ModernDropdown 
          options={categories}
          value={selectedCategory}
          onChange={setSelectedCategory}
          placeholder="Select Category"
        />
      </div>
    </div>
  );
}
