import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, Users, ChevronDown, Building2 } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const AllCompetitors: React.FC = () => {
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter State
  const [categories, setCategories] = useState<string[]>(['All Categories']);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
        // Fetch Categories
        const { data: catData } = await supabase.from('categories').select('name').order('name');
        if (catData) {
            const uniqueCats: string[] = Array.from(new Set(catData.map((c: any) => String(c.name))));
            setCategories(['All Categories', ...uniqueCats]);
        }

        // Fetch All Competitors with School Name
        // We join with profiles table
        const { data, error } = await supabase
            .from('competitors')
            .select(`
                *,
                profiles (
                    school_name,
                    district
                )
            `)
            .order('contest_id', { ascending: true }); // Sort by ID sequence

        if (error) throw error;
        setCompetitors(data || []);

    } catch (error) {
        console.error("Error fetching data", error);
    } finally {
        setLoading(false);
    }
  };

  // Filter Logic
  const filteredCompetitors = competitors.filter(c => {
    const schoolName = c.profiles?.school_name || '';
    const district = c.profiles?.district || '';
    
    const matchesSearch = 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (c.contest_id && c.contest_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All Categories' || c.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      
      {/* Header Section */}
      <div className="border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
            <Users className="text-red-500" size={24} />
            <h2 className="text-lg md:text-xl font-mono text-white tracking-[0.15em] uppercase">GLOBAL_REGISTRY // COMPETITORS</h2>
        </div>
        <p className="text-xs text-red-500/60 font-mono tracking-wider ml-0 md:ml-9">Master database of all registered students sorted by ID.</p>
      </div>

      {/* Controls & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-[350px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={14} />
                <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="SEARCH BY NAME, ID, OR SCHOOL..." 
                    className="w-full bg-dark-800 border border-neutral-800 rounded-sm pl-11 pr-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-red-500 placeholder-neutral-600 transition-colors uppercase"
                />
            </div>

            {/* Filter Dropdown */}
            <div className="relative w-full sm:w-auto">
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center space-x-2 px-5 py-3 w-full sm:w-auto rounded-sm bg-dark-800 border border-neutral-800 hover:border-red-500/50 text-xs font-mono font-bold text-neutral-400 transition-colors tracking-widest uppercase cursor-pointer justify-between"
                >
                    <div className="flex items-center gap-2">
                        <Filter size={14} className="text-red-500" />
                        <span className="truncate max-w-[150px]">{selectedCategory === 'All Categories' ? 'FILTER: ALL' : selectedCategory}</span>
                    </div>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isFilterOpen && (
                <>
                    <div className="fixed inset-0 z-30" onClick={() => setIsFilterOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-64 bg-dark-900 border border-neutral-800 shadow-2xl z-40 overflow-hidden animate-zoom-in-95">
                        <div className="max-h-64 overflow-y-auto custom-scrollbar">
                            {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setIsFilterOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 text-[10px] font-mono font-bold uppercase transition-all border-b border-neutral-900 ${
                                    selectedCategory === cat 
                                    ? 'bg-red-900/20 text-red-500 border-l-2 border-l-red-500' 
                                    : 'text-neutral-500 hover:bg-dark-800 hover:text-white border-l-2 border-l-transparent'
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

        {/* Stats */}
        <div className="flex items-center gap-4">
            <div className="text-right">
                <p className="text-[10px] text-neutral-500 font-mono uppercase">Total Records</p>
                <p className="text-xl font-mono text-white font-bold leading-none">{competitors.length}</p>
            </div>
            <div className="w-px h-8 bg-neutral-800"></div>
            <div className="text-right">
                <p className="text-[10px] text-neutral-500 font-mono uppercase">Filtered View</p>
                <p className="text-xl font-mono text-red-500 font-bold leading-none">{filteredCompetitors.length}</p>
            </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-neutral-800 bg-dark-800 overflow-hidden rounded-sm min-h-[500px]">
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
                <thead>
                    <tr className="bg-dark-700 border-b border-neutral-800">
                        <th className="px-6 py-4 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80 w-32">ID</th>
                        <th className="px-6 py-4 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">Contestant Name</th>
                        <th className="px-6 py-4 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">School Name</th>
                        <th className="px-6 py-4 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">Category</th>
                        <th className="px-6 py-4 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">DOB</th>
                        <th className="px-6 py-4 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">Contact</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900">
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="py-20 text-center">
                                <div className="flex justify-center items-center gap-3 text-red-500 font-mono tracking-widest">
                                    <Loader2 className="animate-spin" size={20} /> LOADING_GLOBAL_DATA...
                                </div>
                            </td>
                        </tr>
                    ) : filteredCompetitors.length > 0 ? (
                        filteredCompetitors.map((item) => (
                            <tr key={item.id} className="group hover:bg-red-500/5 transition-colors">
                                <td className="px-6 py-4 text-xs font-mono text-red-500 font-bold tracking-wider">{item.contest_id || 'PENDING'}</td>
                                <td className="px-6 py-4 text-sm font-bold text-neutral-300 group-hover:text-white transition-colors uppercase">
                                    {item.name}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <Building2 size={12} className="text-neutral-600" />
                                        <span className="text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
                                            {item.profiles?.school_name || 'Unknown School'}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-neutral-600 font-mono ml-5 uppercase">{item.profiles?.district}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-dark-900 border border-neutral-800 text-[10px] font-mono text-neutral-300 uppercase tracking-wide">
                                        {item.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs font-mono text-neutral-500">{item.dob}</td>
                                <td className="px-6 py-4 text-xs font-mono text-neutral-500">{item.contact || '-'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="py-20 text-center">
                                <p className="text-red-500/50 font-mono text-xs tracking-widest uppercase">NO MATCHING RECORDS FOUND IN GLOBAL DATABASE</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AllCompetitors;