import React, { useState, useEffect } from 'react';
import { Search, Layers, Loader2, Hash, Tag, Users } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('code', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (cat.code && cat.code.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
            <h2 className="text-xl font-display font-bold tracking-widest text-white uppercase flex items-center gap-3">
                <Layers className="text-silver-accent" size={24} />
                Category Reference
            </h2>
            <p className="text-[10px] text-neutral-500 font-mono tracking-wider uppercase ml-9">
                Official Event Codes & Age Divisions
            </p>
        </div>

        <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Find Category by Name or Code..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-neutral-800 bg-dark-card/50 text-sm text-neutral-300 focus:outline-none focus:border-silver-500/30 focus:ring-1 focus:ring-silver-500/20 transition-all placeholder-neutral-600"
            />
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-card border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-dark-900/50 border-b border-neutral-800">
                <th className="px-6 py-5 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-widest w-32">
                    Code (ID)
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Event Name
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-widest w-48">
                    Division
                </th>
                <th className="px-6 py-5 text-left text-[10px] font-bold text-neutral-500 uppercase tracking-widest w-48">
                    Age Group
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {loading ? (
                <tr>
                    <td colSpan={4} className="py-20 text-center">
                        <div className="flex justify-center items-center gap-2 text-neutral-500">
                            <Loader2 className="animate-spin" size={20} /> Loading Matrix...
                        </div>
                    </td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((item) => (
                    <tr key={item.id} className="hover:bg-dark-800/30 transition-colors group">
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-silver-accent font-mono text-sm font-bold">
                                <Hash size={14} className="text-neutral-600" />
                                {item.code}
                            </div>
                        </td>
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                                <Tag size={14} className="text-neutral-600 group-hover:text-silver-accent transition-colors" />
                                <span className="text-sm text-white font-medium">{item.name}</span>
                            </div>
                        </td>
                        <td className="px-6 py-5">
                            <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                item.division === 'Junior' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' :
                                item.division === 'Intermediate' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                                item.division === 'Senior' ? 'bg-purple-500/10 border-purple-500/30 text-purple-400' :
                                'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            }`}>
                                {item.division || 'Open'}
                            </span>
                        </td>
                        <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-neutral-500 text-xs font-mono">
                                <Users size={12} />
                                <span>
                                    {item.division === 'Junior' && "Grades 6-9"}
                                    {item.division === 'Intermediate' && "Grades 10-11"}
                                    {item.division === 'Senior' && "Grades 12-13"}
                                    {(item.division === 'Open' || !item.division) && "All Grades"}
                                </span>
                            </div>
                        </td>
                    </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={4} className="py-12 text-center text-neutral-600 text-xs uppercase tracking-widest">
                        No categories found.
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

export default CategoryList;