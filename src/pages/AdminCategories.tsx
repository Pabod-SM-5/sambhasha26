import React, { useState } from 'react';
import AdminLayout from '../components/Admin/AdminLayout';
import { Layers, Plus, Trash2, Edit2, Check, X } from 'lucide-react';

// Mock Categories
const INITIAL_CATEGORIES = [
  { id: '1', name: 'Software Development', tiers: ['Junior', 'Intermediate', 'Senior'], language: 'English' },
  { id: '2', name: 'Robotics', tiers: ['Intermediate', 'Senior'], language: 'English' },
  { id: '3', name: 'Creative Writing', tiers: ['Junior', 'Intermediate', 'Senior'], language: 'Sinhala' },
  { id: '4', name: 'Web Design', tiers: ['Senior'], language: 'English' },
  { id: '5', name: 'Digital Art', tiers: ['Junior', 'Intermediate'], language: 'English' },
];

const TIERS = ['Junior', 'Intermediate', 'Senior'];
const LANGUAGES = ['Sinhala', 'English', 'Tamil'];

export default function AdminCategories() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [newCategory, setNewCategory] = useState({
    id: '',
    name: '',
    tiers: [] as string[],
    language: 'English'
  });

  const handleTierToggle = (tier: string) => {
    setNewCategory(prev => {
      const tiers = prev.tiers.includes(tier)
        ? prev.tiers.filter(t => t !== tier)
        : [...prev.tiers, tier];
      return { ...prev, tiers };
    });
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.id || !newCategory.name || newCategory.tiers.length === 0) return;

    setCategories([...categories, newCategory]);
    setNewCategory({ id: '', name: '', tiers: [], language: 'English' });
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Category Management</h2>
          <p className="text-sm text-white/40 mt-1">Define competition structure and age groups</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Category Form */}
          <div className="lg:col-span-1">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl p-6 shadow-lg shadow-black/50 sticky top-24">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" />
                Create New Category
              </h3>
              
              <form onSubmit={handleAddCategory} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-white/40 font-bold">Category ID</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 14" 
                    value={newCategory.id}
                    onChange={(e) => setNewCategory({...newCategory, id: e.target.value})}
                    className="w-full bg-[#141414]/50 border border-red-900/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-900/50 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-white/40 font-bold">Category Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., AI Innovation" 
                    value={newCategory.name}
                    onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                    className="w-full bg-[#141414]/50 border border-red-900/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-900/50 transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-wider text-white/40 font-bold">Age Tiers</label>
                  <div className="flex flex-wrap gap-2">
                    {TIERS.map(tier => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => handleTierToggle(tier)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          newCategory.tiers.includes(tier)
                            ? 'bg-red-900/20 border-red-900/50 text-red-400'
                            : 'bg-[#141414] border-red-900/30 text-white/60 hover:bg-[#1a1a1a]'
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-white/40 font-bold">Language Medium</label>
                  <select 
                    value={newCategory.language}
                    onChange={(e) => setNewCategory({...newCategory, language: e.target.value})}
                    className="w-full bg-[#141414]/50 border border-red-900/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-900/50 appearance-none cursor-pointer"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-[#141414] hover:bg-[#1a1a1a] border border-red-900/30 text-white font-bold rounded-xl shadow-lg shadow-black/50 transition-all mt-4 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </form>
            </div>
          </div>

          {/* Category List Table */}
          <div className="lg:col-span-2">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl overflow-hidden shadow-lg shadow-black/50">
              <div className="px-6 py-4 border-b border-red-900/30 flex items-center justify-between bg-[#141414]/50">
                <h3 className="text-sm font-semibold text-white">Existing Categories</h3>
                <span className="px-3 py-1 rounded-full bg-[#141414] border border-red-900/30 text-xs text-white/40">
                  {categories.length} Total
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#141414]/80">
                    <tr className="border-b border-red-900/30">
                      <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider w-20">ID</th>
                      <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Category Name</th>
                      <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Tiers</th>
                      <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Language</th>
                      <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-red-900/30">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="group hover:bg-[#141414]/50 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-white/40 group-hover:text-white/60">
                          {cat.id}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          {cat.name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {cat.tiers.map(tier => (
                              <span key={tier} className="px-1.5 py-0.5 rounded bg-[#141414] border border-red-900/30 text-[10px] text-white/60">
                                {tier.substring(0, 3)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs text-white/60">
                          {cat.language}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button 
                              title="Delete Category"
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-2 hover:bg-red-500/10 text-red-500/60 hover:text-red-500 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-white/20 text-sm">
                          No categories defined yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
