import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Layers, Loader2, Tag, Hash, Users } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { logSystemAction } from '../../lib/logger';
import { addCategoryAdmin, deleteCategoryAdmin } from '../../lib/adminApi';
import { secureLogger } from '../../lib/secureLogs';

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  
  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [division, setDivision] = useState('Open');
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
        const { data, error } = await supabase.from('categories').select('*').order('code', { ascending: true });
        if (error) throw error;
        setCategories(data || []);
    } catch (error) {
        console.error("Error fetching categories", error);
    } finally {
        setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!name.trim() || !code.trim()) {
        alert("Name and Code are required");
        return;
    }
    
    // Ensure code is 2 digits
    const formattedCode = code.length === 1 ? `0${code}` : code;

    try {
        // ========== SECURITY: Call RPC Function (Database-level authorization) ==========
        const result = await addCategoryAdmin(name.trim(), formattedCode, division);
        
        if (!result.success) {
            secureLogger.warn('Failed to add category', { 
                name: name.trim(),
                reason: result.message 
            });
            alert(result.message || "Failed to add category.");
            return;
        }
        
        // Log action
        await logSystemAction('Admin Add Category', `Created new category: ${name} (${division}) - Code: ${formattedCode}`);

        // Reset form
        setName('');
        setCode('');
        setDivision('Open');
        fetchCategories();
    } catch (error) {
        secureLogger.error("Error adding category", { error: error instanceof Error ? error.message : 'Unknown error' });
        alert("Failed to add category. Please try again.");
    }
  };

  const handleDeleteCategory = async (id: number, catName: string) => {
    if (window.confirm("Delete this category? This action cannot be undone.")) {
        try {
            // ========== SECURITY: Call RPC Function (Database-level authorization) ==========
            const result = await deleteCategoryAdmin(id);
            
            if (!result.success) {
                secureLogger.warn('Failed to delete category', { 
                    categoryId: id,
                    reason: result.message 
                });
                alert(result.message || "Failed to delete category.");
                return;
            }
            
            // Log action
            await logSystemAction('Admin Delete Category', `Deleted category: ${catName}`);

            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            secureLogger.error("Error deleting category", { error: error instanceof Error ? error.message : 'Unknown error' });
            alert("Failed to delete category. Please try again.");
        }
    }
  };

  if (loading) {
    return (
        <div className="flex h-96 items-center justify-center text-red-500 font-mono tracking-widest">
            <Loader2 className="animate-spin mr-3" /> LOADING_CONFIG...
        </div>
    );
  }

  return (
    <div className="space-y-10 animate-slide-up">
      <div className="border-b border-neutral-800 pb-6">
        <div className="flex items-center gap-3 mb-2">
            <Layers className="text-red-500" size={24} />
            <h2 className="text-lg md:text-xl font-mono text-white tracking-[0.15em] uppercase">SYSTEM_CONFIG // MASTER_CATEGORIES</h2>
        </div>
        <p className="text-xs text-red-500/60 font-mono tracking-wider ml-0 md:ml-9">Define events, ID codes (XX), and Age Divisions.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left: Add New Form */}
        <div className="xl:col-span-1 p-1 border border-red-500/30 border-dashed rounded-sm bg-red-500/5 h-fit">
            <div className="bg-dark-800 p-6 md:p-8 flex flex-col space-y-6">
                <div className="space-y-2">
                    <span className="text-xs font-mono text-red-500 tracking-[0.2em] uppercase font-bold block">NEW PROTOCOL INITIATION</span>
                    <p className="text-[10px] text-neutral-500 font-mono">Create entry for ID Generation Matrix.</p>
                </div>
                
                <div className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-mono text-neutral-400 uppercase">Event Name</label>
                        <div className="relative">
                            <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                            <input 
                                type="text" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Sinhala Announcing"
                                className="w-full bg-black border border-neutral-800 pl-9 pr-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-red-500 placeholder-neutral-700 tracking-wider transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Code */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase">Code (XX)</label>
                            <div className="relative">
                                <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                                <input 
                                    type="text" 
                                    maxLength={2}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.replace(/\D/g,''))} // Only numbers
                                    placeholder="01"
                                    className="w-full bg-black border border-neutral-800 pl-9 pr-4 py-3 text-xs font-mono text-red-500 focus:outline-none focus:border-red-500 placeholder-neutral-700 tracking-wider transition-colors"
                                />
                            </div>
                        </div>

                        {/* Division */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-mono text-neutral-400 uppercase">Division</label>
                            <div className="relative">
                                <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
                                <select 
                                    value={division}
                                    onChange={(e) => setDivision(e.target.value)}
                                    className="w-full bg-black border border-neutral-800 pl-9 pr-4 py-3 text-xs font-mono text-white focus:outline-none focus:border-red-500 tracking-wider transition-colors appearance-none"
                                >
                                    <option value="Junior">Junior</option>
                                    <option value="Intermediate">Inter..</option>
                                    <option value="Senior">Senior</option>
                                    <option value="Open">Open</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleAddCategory}
                        className="w-full py-4 mt-2 bg-red-600 text-white text-xs font-bold font-mono tracking-[0.15em] uppercase flex items-center justify-center gap-2 hover:bg-red-700 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer"
                    >
                        <Plus size={16} strokeWidth={3} /> ADD TO MATRIX
                    </button>
                </div>
            </div>
        </div>

        {/* Right: List */}
        <div className="xl:col-span-2 space-y-3">
             {/* Header Row */}
            <div className="flex px-5 py-2 text-[10px] font-mono text-red-500/50 uppercase tracking-widest border-b border-neutral-800">
                <span className="w-16">Code</span>
                <span className="flex-1">Event Name</span>
                <span className="w-24">Division</span>
                <span className="w-10"></span>
            </div>

            <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {categories.map((cat) => (
                    <div key={cat.id} className="group bg-dark-800 border border-neutral-800 p-4 flex items-center gap-4 hover:border-red-500/50 transition-all duration-300">
                        <div className="w-16 flex-shrink-0">
                            <span className="text-lg font-mono text-red-500 font-bold">{cat.code || '--'}</span>
                        </div>
                        <div className="flex-1">
                            <span className="text-sm font-mono text-neutral-300 group-hover:text-white tracking-wide transition-colors block">{cat.name}</span>
                        </div>
                        <div className="w-24">
                            <span className={`px-2 py-1 text-[10px] font-mono uppercase border rounded border-neutral-700 ${
                                cat.division === 'Junior' ? 'text-blue-400 bg-blue-500/10' :
                                cat.division === 'Intermediate' ? 'text-yellow-400 bg-yellow-500/10' :
                                cat.division === 'Senior' ? 'text-purple-400 bg-purple-500/10' :
                                'text-emerald-400 bg-emerald-500/10'
                            }`}>
                                {cat.division || 'Open'}
                            </span>
                        </div>
                        <div className="w-10 flex justify-end">
                            <button 
                                onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                className="text-neutral-600 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-full cursor-pointer"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {categories.length === 0 && (
                <div className="p-8 text-center border border-neutral-800 border-dashed">
                    <p className="text-red-500/50 font-mono text-xs">NO CATEGORIES DEFINED IN MATRIX</p>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default CategoryManager;