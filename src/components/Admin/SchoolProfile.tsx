import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, Activity, User, Phone, Calendar, CreditCard, Loader2, Filter, ChevronDown, PieChart, RefreshCcw } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import DeleteContestantModal from './DeleteContestantModal';
import { logSystemAction } from '../../lib/logger';
import { deleteCompetitorAdmin } from '../../lib/adminApi';
import { secureLogger } from '../../lib/secureLogs';

const SchoolProfile: React.FC = () => {
  const { schoolId } = useParams();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<any>(null);
  const [contestants, setContestants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedContestant, setSelectedContestant] = useState<{id: number, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (schoolId) {
        fetchSchoolData();
    }
  }, [schoolId]);

  const fetchSchoolData = async () => {
    setLoading(true);
    try {
        // Fetch Profile
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', schoolId)
            .single();
        
        if (profileError) throw profileError;
        setProfile(profileData);

        // Fetch Contestants
        const { data: competitorsData, error: competitorsError } = await supabase
            .from('competitors')
            .select('*')
            .eq('school_id', schoolId)
            .order('created_at', { ascending: false }); 
        
        if (competitorsError) throw competitorsError;
        
        const data = competitorsData || [];
        setContestants(data);

        // Extract unique categories for filter
        if (data.length > 0) {
            const cats: string[] = Array.from(new Set(data.map((c: any) => String(c.category))));
            setUniqueCategories(['All Categories', ...cats]);
        } else {
            setUniqueCategories(['All Categories']);
        }

    } catch (error) {
        console.error("Error fetching school data", error);
    } finally {
        setLoading(false);
    }
  };
  
  // Filter Logic
  const filteredContestants = selectedCategory === 'All Categories'
    ? contestants
    : contestants.filter(c => c.category === selectedCategory);

  // Stats Calculation
  const totalContestants = contestants.length;
  const categoryBreakdown = contestants.reduce((acc: any, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + 1;
    return acc;
  }, {});

  // Open Delete Modal
  const requestDelete = (id: number, name: string) => {
    setSelectedContestant({ id, name });
    setDeleteModalOpen(true);
  };

  // Perform Delete
  const handleConfirmDelete = async () => {
    if (!selectedContestant) return;
    
    setIsDeleting(true);
    try {
        // ========== SECURITY: Call RPC Function (Database-level authorization) ==========
        const result = await deleteCompetitorAdmin(selectedContestant.id);
        
        if (!result.success) {
            secureLogger.warn('Failed to delete competitor', { 
                competitorId: selectedContestant.id,
                reason: result.message 
            });
            alert(result.message || "Delete failed. Please try again.");
            setIsDeleting(false);
            return;
        }
        
        // Log the action
        await logSystemAction(
            'Admin Delete Competitor', 
            `Removed "${selectedContestant.name}" from ${profile.school_name}`
        );

        // Update state locally
        const updatedList = contestants.filter(c => c.id !== selectedContestant.id);
        setContestants(updatedList);
        
        // Re-calc unique categories
        const cats = Array.from(new Set(updatedList.map((c: any) => c.category)));
        setUniqueCategories(['All Categories', ...cats]);

        setDeleteModalOpen(false);
        setSelectedContestant(null);

    } catch (error) {
        secureLogger.error("Error deleting contestant", { error: error instanceof Error ? error.message : 'Unknown error' });
        alert("Delete failed. Please try again.");
    } finally {
        setIsDeleting(false);
    }
  };

  if (loading) {
     return (
        <div className="flex h-96 items-center justify-center text-red-500 font-mono tracking-widest">
            <Loader2 className="animate-spin mr-3" /> ACCESSING_DATABASE...
        </div>
     );
  }

  if (!profile) {
      return <div className="text-white p-8">Profile not found.</div>;
  }

  return (
    <div className="space-y-8 animate-slide-in-right pb-20">
       
       {/* Breadcrumb / Header */}
       <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-2 text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-70">
                <span>ROOT</span>
                <span className="text-neutral-600">/</span>
                <span>INTEL</span>
                <span className="text-neutral-600">/</span>
                <span className="truncate max-w-[100px]">{schoolId}</span>
           </div>
           <button 
                onClick={fetchSchoolData}
                className="flex items-center gap-2 text-[10px] font-mono text-neutral-500 hover:text-white transition-colors uppercase tracking-widest"
           >
               <RefreshCcw size={12} /> REFRESH
           </button>
       </div>

       {/* Top Bar - School Details */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-neutral-800 pb-8 bg-dark-800 p-6 border rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Activity size={100} className="text-red-500" />
            </div>
            
            <div className="flex flex-col sm:flex-row items-start gap-6 z-10">
                <button 
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2 px-5 py-2.5 bg-dark-900 border border-neutral-800 text-neutral-400 hover:text-red-500 hover:border-red-500 transition-all text-xs font-mono tracking-[0.15em] uppercase group cursor-pointer"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    RETURN
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-mono text-white tracking-widest uppercase mb-3 font-bold break-words">{profile.school_name}</h1>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-neutral-500">
                        <span className="flex items-center gap-2"><span className="text-red-500">TIC:</span> {profile.tic_name}</span>
                        <span className="hidden sm:block w-px h-3 bg-neutral-800"></span>
                        <span className="flex items-center gap-2"><span className="text-red-500">PHONE:</span> {profile.phone}</span>
                        <span className="hidden sm:block w-px h-3 bg-neutral-800"></span>
                        <span className="flex items-center gap-2"><span className="text-red-500">DISTRICT:</span> {profile.district}</span>
                    </div>
                </div>
            </div>
       </div>

       {/* Statistics Section */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Count Card */}
            <div className="bg-dark-900 border border-neutral-800 p-6 flex items-center justify-between group hover:border-red-500/30 transition-colors">
                <div>
                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-1">Total Contestants</p>
                    <p className="text-3xl font-mono text-white font-bold">{totalContestants}</p>
                </div>
                <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                    <User size={24} />
                </div>
            </div>

            {/* Category Breakdown */}
            <div className="md:col-span-2 bg-dark-900 border border-neutral-800 p-6 relative overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                    <PieChart size={16} className="text-red-500" />
                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Category Breakdown</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {Object.entries(categoryBreakdown).map(([cat, count]: [string, any]) => (
                        <div key={cat} className="px-3 py-1.5 bg-dark-800 border border-neutral-800 rounded flex items-center gap-2">
                            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{cat}</span>
                            <span className="text-xs font-bold text-red-500">{count}</span>
                        </div>
                    ))}
                    {Object.keys(categoryBreakdown).length === 0 && (
                        <span className="text-[10px] text-neutral-600 font-mono italic">No entries yet.</span>
                    )}
                </div>
            </div>
       </div>

       {/* Filter & Table Header */}
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-neutral-800 pb-4">
            <div className="space-y-1">
                <h3 className="text-lg font-mono text-white uppercase tracking-widest">Contestant Registry</h3>
                <p className="text-[10px] text-neutral-500 font-mono">Viewing records for {profile.school_name}</p>
            </div>

            {/* Modern Dropdown Filter */}
            <div className="relative z-20">
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    disabled={uniqueCategories.length <= 1}
                    className="flex items-center space-x-2 px-5 py-3 rounded bg-dark-900 border border-neutral-800 hover:bg-dark-800 text-xs font-mono font-bold text-neutral-400 transition-colors tracking-widest uppercase cursor-pointer min-w-[200px] justify-between disabled:opacity-50 disabled:cursor-not-allowed"
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
                    <div className="absolute top-full right-0 mt-2 w-64 bg-dark-900 border border-neutral-800 rounded shadow-2xl z-40 overflow-hidden animate-zoom-in-95 ring-1 ring-white/5">
                        <div className="max-h-64 overflow-y-auto custom-scrollbar p-1">
                            {uniqueCategories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat);
                                    setIsFilterOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-xs font-mono font-medium transition-all ${
                                    selectedCategory === cat 
                                    ? 'bg-red-500/10 text-red-500 border-l-2 border-red-500' 
                                    : 'text-neutral-400 hover:bg-dark-800 hover:text-white border-l-2 border-transparent'
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

       {/* Table Container - Scrollable */}
       <div className="border border-neutral-800 bg-dark-800 overflow-hidden rounded-sm min-h-[300px]">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                    <thead>
                        <tr className="bg-dark-700 border-b border-neutral-800">
                            <th className="px-6 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">ID</th>
                            <th className="px-6 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">Contestant Name</th>
                            <th className="px-6 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">Category</th>
                            <th className="px-6 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">DOB</th>
                            <th className="px-6 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">Contact</th>
                            <th className="px-6 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">NIC</th>
                            <th className="px-6 py-5 text-right text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                        {filteredContestants.length > 0 ? (
                            filteredContestants.map((item, idx) => (
                                <tr key={item.id} className="group hover:bg-red-500/5 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono text-red-500 font-bold">{item.contest_id || `#${idx+1}`}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-white flex items-center gap-2">
                                        <User size={12} className="text-neutral-600" />
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-dark-700 border border-neutral-800 text-[10px] font-mono text-neutral-300 uppercase tracking-wide group-hover:border-red-500/50 transition-colors">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono text-neutral-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={12} className="opacity-50" />
                                            {item.dob}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono text-neutral-500">
                                        <div className="flex items-center gap-2">
                                            <Phone size={12} className="opacity-50" />
                                            {item.contact || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-mono text-neutral-500">
                                        <div className="flex items-center gap-2">
                                            <CreditCard size={12} className="opacity-50" />
                                            {item.nic || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                                onClick={() => requestDelete(item.id, item.name)}
                                                className="text-neutral-600 hover:text-red-600 transition-colors p-1.5 hover:bg-red-500/10 rounded cursor-pointer"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="py-12 text-center">
                                    <p className="text-red-500 font-mono text-sm tracking-widest opacity-50">
                                        {contestants.length === 0 ? "NO DATA EXISTS FOR THIS SCHOOL" : "NO MATCHING RECORDS FOUND"}
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Delete Modal */}
        <DeleteContestantModal 
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            contestantName={selectedContestant?.name || ''}
            isDeleting={isDeleting}
        />

    </div>
  );
};

export default SchoolProfile;