import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, ChevronDown } from 'lucide-react';
import AddCompetitorModal from './AddCompetitorModal';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { logSystemAction } from '../../lib/logger';

const CompetitorTable: React.FC = () => {
  const { user } = useAuth();
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter State
  const [categories, setCategories] = useState<string[]>(['All Categories']);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  // Fetch data on mount
  useEffect(() => {
    if (user) {
      fetchCompetitors();
      fetchCategories();
    }
  }, [user]);

  const fetchCategories = async () => {
    try {
      const { data } = await supabase.from('categories').select('name').order('name');
      if (data) {
        // Extract unique names
        const uniqueCats: string[] = Array.from(new Set(data.map((c: any) => String(c.name))));
        setCategories(['All Categories', ...uniqueCats]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCompetitors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('competitors')
        .select('*')
        .eq('school_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompetitors(data || []);
    } catch (error) {
      console.error('Error fetching competitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompetitor = async (newCompetitor: any) => {
    try {
      // Optimistic update or just re-fetch
      const { error } = await supabase.from('competitors').insert([
        {
          school_id: user?.id,
          name: newCompetitor.name,
          contest_id: newCompetitor.contestId,
          category: newCompetitor.category,
          dob: newCompetitor.dob,
          contact: newCompetitor.contact || 'N/A', // Add contact field if your modal supports it, else default
          nic: newCompetitor.nic
        }
      ]);

      if (error) throw error;
      
      // Log Action
      await logSystemAction('ADD_COMPETITOR', `Registered ${newCompetitor.name} (${newCompetitor.contestId}) to ${newCompetitor.category}`);

      fetchCompetitors(); // Refresh list
    } catch (error) {
      console.error('Error adding competitor:', error);
      alert('Failed to add competitor.');
    }
  };

  // Filter Logic
  const filteredCompetitors = competitors.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.contest_id && c.contest_id.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'All Categories' || c.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Actions Row */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Competitor by Name / ID"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-800 bg-dark-card/50 text-sm text-neutral-300 focus:outline-none focus:border-silver-500/30 focus:ring-1 focus:ring-silver-500/20 transition-all placeholder-neutral-600"
            />
          </div>
          
          {/* Filter Dropdown */}
          <div className="relative">
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-dark-900 border border-neutral-800 hover:bg-dark-800 text-xs font-bold text-neutral-400 transition-colors tracking-widest uppercase cursor-pointer min-w-[140px] justify-between"
            >
                <div className="flex items-center gap-2">
                    <Filter size={14} />
                    <span className="truncate max-w-[120px]">{selectedCategory === 'All Categories' ? 'FILTER' : selectedCategory}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute top-full left-0 md:left-auto md:right-0 mt-2 w-64 bg-dark-card border border-neutral-800 rounded-xl shadow-2xl z-50 overflow-hidden animate-zoom-in-95 ring-1 ring-white/5">
                    <div className="max-h-64 overflow-y-auto custom-scrollbar p-1">
                        {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => {
                                setSelectedCategory(cat);
                                setIsFilterOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-xs font-medium rounded-lg transition-all ${
                                selectedCategory === cat 
                                ? 'bg-silver-accent text-black font-bold' 
                                : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                            }`}
                        >
                            {cat}
                        </button>
                        ))}
                    </div>
                </div>
              </>
            )}
          </div>
        </div>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-8 py-3 rounded-xl bg-gradient-to-b from-neutral-200 to-neutral-400 hover:from-white hover:to-neutral-300 text-black text-xs font-bold transition-all shadow-lg shadow-white/5 active:scale-95 tracking-widest uppercase border-none cursor-pointer"
        >
          Add New Competitor
        </button>
      </div>

      {/* Table */}
      <div className="bg-dark-card border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-dark-900/50 border-b border-neutral-800">
                {[
                  { label: 'SNO', width: 'w-16' },
                  { label: "CONTESTANT'S NAME", width: 'w-auto' },
                  { label: "CONTESTANT'S ID", width: 'w-auto' },
                  { label: 'CATEGORY', width: 'w-auto' },
                  { label: 'DATE OF BIRTH', width: 'w-auto' },
                  { label: 'CONTACT NO', width: 'w-auto' },
                  { label: 'NIC NUMBER', width: 'w-auto' },
                ].map((header) => (
                  <th key={header.label} className={`px-6 py-5 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-widest ${header.width}`}>
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {loading ? (
                <tr>
                    <td colSpan={7} className="py-12 text-center">
                        <div className="flex justify-center items-center gap-2 text-neutral-500">
                            <Loader2 className="animate-spin" size={20} /> Loading Data...
                        </div>
                    </td>
                </tr>
              ) : filteredCompetitors.length > 0 ? (
                filteredCompetitors.map((item, index) => (
                    <tr key={item.id} className="hover:bg-dark-800/30 transition-colors group">
                    <td className="px-6 py-5 text-sm font-bold text-neutral-400">{String(index + 1).padStart(2, '0')}</td>
                    <td className="px-6 py-5 text-sm text-white font-medium">{item.name}</td>
                    <td className="px-6 py-5 text-sm text-silver-accent/80 font-mono">{item.contest_id || '-'}</td>
                    <td className="px-6 py-5 text-sm text-neutral-400">
                        <span className="px-2 py-1 rounded bg-dark-900 border border-neutral-800 text-xs">
                        {item.category}
                        </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-neutral-400">{item.dob}</td>
                    <td className="px-6 py-5 text-sm text-neutral-400">{item.contact || '-'}</td>
                    <td className="px-6 py-5 text-sm text-neutral-400">{item.nic || '-'}</td>
                    </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-600 text-xs uppercase tracking-widest">
                        {searchTerm || selectedCategory !== 'All Categories' 
                            ? "No matching competitors found."
                            : "No competitors found. Add one to get started."}
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Visual only for now unless logic added) */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-neutral-800 bg-dark-900/30">
          <span className="text-[10px] text-neutral-500 font-medium tracking-wider uppercase">Showing {filteredCompetitors.length} entries</span>
          <div className="flex items-center space-x-2">
            <button disabled className="px-3 py-1.5 rounded-lg bg-dark-900 border border-neutral-800 text-[10px] font-bold text-neutral-500 opacity-50 cursor-not-allowed uppercase tracking-wider">Previous</button>
            <button disabled className="px-3 py-1.5 rounded-lg bg-dark-900 border border-neutral-800 text-[10px] font-bold text-neutral-500 opacity-50 cursor-not-allowed uppercase tracking-wider">Next</button>
          </div>
        </div>
      </div>

      {isAddModalOpen && (
        <AddCompetitorModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddCompetitor} />
      )}
    </div>
  );
};

export default CompetitorTable;