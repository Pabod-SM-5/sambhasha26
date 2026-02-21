import React, { useState, useEffect } from 'react';
import { Users, Activity, Shield, Search, FileDown, Trash2, Loader2, Power, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import DeleteConfirmationModal from './DeleteConfirmationModal';

const DashboardOverview: React.FC = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ schools: 0, competitors: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch Schools (profiles where role is 'user')
      const { data: schoolsData, error: schoolsError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'user')
        .order('created_at', { ascending: false });

      if (schoolsError) throw schoolsError;
      setSchools(schoolsData || []);

      // Fetch Competitors count
      const { count, error: countError } = await supabase
        .from('competitors')
        .select('*', { count: 'exact', head: true });
      
      if (countError) throw countError;

      setStats({
        schools: schoolsData?.length || 0,
        competitors: count || 0
      });

    } catch (error) {
      console.error('Error fetching admin dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Functionality: Search
  const filteredSchools = schools.filter(school => 
    (school.school_name && school.school_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (school.district && school.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (school.school_id && school.school_id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Functionality: Deactivate / Activate
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const actionName = newStatus === 'active' ? 'ACTIVATE' : 'DEACTIVATE';

    if (window.confirm(`Are you sure you want to ${actionName} this account?`)) {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;

            // Optimistic Update
            setSchools(schools.map(s => s.id === id ? { ...s, status: newStatus } : s));

        } catch (error) {
            console.error("Status update failed:", error);
            alert(`Failed to ${actionName.toLowerCase()} account.`);
        }
    }
  };

  // Functionality: Open Delete Modal
  const openDeleteModal = (id: string, schoolName: string) => {
    setSchoolToDelete({ id, name: schoolName });
    setIsDeleteModalOpen(true);
  };

  // Functionality: Perform Delete
  const handleConfirmDelete = async () => {
    if (!schoolToDelete) return;

    setIsDeleting(true);
    try {
        // Call the Secure RPC function
        const { error } = await supabase.rpc('delete_user_by_admin', { target_user_id: schoolToDelete.id });
        
        if (error) throw error;
        
        // UI Update
        setSchools(schools.filter(s => s.id !== schoolToDelete.id));
        setStats(prev => ({ ...prev, schools: prev.schools - 1 }));

        // Close modal
        setIsDeleteModalOpen(false);
        setSchoolToDelete(null);

    } catch (error: any) {
        console.error("Delete failed:", error);
        alert("Failed to delete school. " + (error.message || "Check permissions."));
    } finally {
        setIsDeleting(false);
    }
  };

  if (loading) {
    return (
        <div className="flex h-96 items-center justify-center text-red-500 font-mono tracking-widest">
            <Loader2 className="animate-spin mr-3" /> LOADING_SYSTEM_DATA...
        </div>
    );
  }

  return (
    <div className="space-y-10 animate-slide-up">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Card 1 */}
        <div className="bg-dark-800 border border-neutral-800 p-6 md:p-8 relative group overflow-hidden hover:border-red-500/30 transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] text-red-500 font-mono tracking-[0.2em] uppercase opacity-70">Registered Schools</span>
                <Users size={20} className="text-red-500" />
            </div>
            <div className="text-4xl md:text-5xl font-mono text-white font-light">{stats.schools}</div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        </div>

        {/* Card 2 */}
        <div className="bg-dark-800 border border-neutral-800 p-6 md:p-8 relative group overflow-hidden hover:border-red-500/30 transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] text-red-500 font-mono tracking-[0.2em] uppercase opacity-70">Total Contestants</span>
                <Activity size={20} className="text-red-500" />
            </div>
            <div className="text-4xl md:text-5xl font-mono text-white font-light">{stats.competitors}</div>
             <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        </div>

        {/* Card 3 */}
        <div className="bg-dark-800 border border-neutral-800 p-6 md:p-8 relative group overflow-hidden hover:border-red-500/30 transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] text-red-500 font-mono tracking-[0.2em] uppercase opacity-70">System Status</span>
                <Shield size={20} className="text-red-500" />
            </div>
            <div className="text-xl md:text-2xl font-mono text-red-500 mt-4 tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></span>
              ONLINE_RW
            </div>
             <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        </div>
      </div>

      {/* Master Registry */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-neutral-800 pb-6">
            <div>
              <h2 className="text-lg md:text-xl font-mono text-white tracking-[0.15em] uppercase">MASTER_REGISTRY</h2>
              <p className="text-[10px] text-red-500/60 font-mono mt-1 tracking-wider">DATABASE_V.2.4 // SECURE_ACCESS</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                <div className="relative w-full sm:flex-1 md:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500/50" size={14} />
                    <input 
                        type="text" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="SEARCH_DB..." 
                        className="w-full bg-dark-700 border border-neutral-800 rounded-sm pl-11 pr-4 py-3 text-xs font-mono text-red-500 focus:outline-none focus:border-red-500 placeholder-neutral-700 transition-colors"
                    />
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3 bg-dark-700 border border-neutral-800 text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-all text-xs font-mono tracking-wider group cursor-pointer">
                    <FileDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                    <span>EXPORT_CSV</span>
                </button>
            </div>
        </div>

        {/* Table Container - Scrollable */}
        <div className="border border-neutral-800 bg-dark-800 overflow-hidden rounded-sm min-h-[400px]">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="bg-dark-700 border-b border-neutral-800">
                            <th className="px-6 md:px-8 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">School Name</th>
                            <th className="px-6 md:px-8 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">District</th>
                            <th className="px-6 md:px-8 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">TIC Details</th>
                            <th className="px-6 md:px-8 py-5 text-left text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">Status</th>
                            <th className="px-6 md:px-8 py-5 text-right text-[10px] font-mono text-red-500 uppercase tracking-[0.2em] opacity-80">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900">
                        {filteredSchools.length > 0 ? (
                        filteredSchools.map((school) => {
                            const isInactive = school.status === 'inactive';
                            return (
                                <tr key={school.id} className={`group hover:bg-red-500/5 transition-colors duration-300 ${isInactive ? 'opacity-60 bg-red-900/5' : ''}`}>
                                    <td 
                                        onClick={() => navigate(`/admin/school/${school.id}`)}
                                        className="px-6 md:px-8 py-5 text-sm font-bold text-neutral-300 font-serif tracking-wide group-hover:text-white transition-colors cursor-pointer"
                                    >
                                        {school.school_name}
                                    </td>
                                    <td className="px-6 md:px-8 py-5 text-xs font-mono text-neutral-500 group-hover:text-red-500 transition-colors">{school.district}</td>
                                    <td className="px-6 md:px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-neutral-400 group-hover:text-white">{school.tic_name}</span>
                                            <span className="text-[10px] text-neutral-600 font-mono group-hover:text-red-500/70">{school.phone}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 md:px-8 py-5">
                                        <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] font-mono uppercase font-bold tracking-wider ${isInactive ? 'border-red-500/30 text-red-500 bg-red-500/10' : 'border-green-500/30 text-green-500 bg-green-500/10'}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${isInactive ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                            {isInactive ? 'INACTIVE' : 'ACTIVE'}
                                        </div>
                                    </td>
                                    <td className="px-6 md:px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-3 md:gap-4">
                                            {/* Deactivate / Activate Button */}
                                            <button 
                                                onClick={() => handleToggleStatus(school.id, school.status || 'active')}
                                                className={`transition-colors transform hover:scale-110 cursor-pointer p-1.5 rounded ${isInactive ? 'text-green-500 hover:bg-green-500/10' : 'text-orange-500 hover:bg-orange-500/10'}`}
                                                title={isInactive ? "Activate Account" : "Deactivate Account"}
                                            >
                                                {isInactive ? <Zap size={16} /> : <Power size={16} />}
                                            </button>

                                            {/* Delete Button (Triggers Modal) */}
                                            <button 
                                                onClick={() => openDeleteModal(school.id, school.school_name)}
                                                className="text-neutral-600 hover:text-red-600 transition-colors transform hover:scale-110 cursor-pointer p-1.5 rounded hover:bg-red-500/10"
                                                title="Permanently Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                        ) : (
                        <tr>
                            <td colSpan={5} className="py-12 text-center">
                            <p className="text-red-500 font-mono text-sm tracking-widest">NO RECORDS FOUND</p>
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal 
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            schoolName={schoolToDelete?.name || ''}
            isDeleting={isDeleting}
        />
      </div>
    </div>
  );
};

export default DashboardOverview;