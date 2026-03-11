import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '../components/Admin/AdminLayout';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Users, 
  Trophy, 
  Calendar, 
  Download, 
  ArrowLeft,
  Eye,
  Trash2
} from 'lucide-react';
import StatusBadge from '../components/Admin/ui/StatusBadge';
import ActionButton from '../components/Admin/ui/ActionButton';
import SearchFilterBar from '../components/Admin/ui/SearchFilterBar';
import Pagination from '../components/Admin/ui/Pagination';

// Mock Data for the School Profile
const MOCK_SCHOOL_DETAILS = {
  id: 'SCH001',
  name: 'Royal College',
  address: 'Reid Avenue, Colombo 07',
  email: 'principal@royal.lk',
  phone: '+94 11 269 1029',
  website: 'https://royalcollege.lk',
  principal: 'Mr. Thilak Waththuhewa',
  registeredDate: '2024-01-15',
  totalEntries: 45,
  activeContestants: 42,
  status: 'Active'
};

// Mock Data for Contestants (Same structure as AdminContestants)
const MOCK_CONTESTANTS = [
  { id: 'C001', name: 'Kasun Perera', category: 'Software', mobile: '0771234567', nic: '200512345678', status: 'Pending' },
  { id: 'C009', name: 'Sahan Gunasekara', category: 'Robotics', mobile: '0712233445', nic: '200612345678', status: 'Approved' },
  { id: 'C015', name: 'Malith De Silva', category: 'Creative', mobile: '0769988776', nic: '200598765432', status: 'Rejected' },
  { id: 'C022', name: 'Nuwan Pradeep', category: 'Software', mobile: '0705566778', nic: '200655667788', status: 'Approved' },
  { id: 'C034', name: 'Isuru Udana', category: 'Research', mobile: '0784433221', nic: '200544332211', status: 'Pending' },
];

const CATEGORIES = ['All', 'Software', 'Robotics', 'Creative', 'Research'];

export default function AdminSchoolProfile() {
  const { id } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter Logic
  const filteredContestants = MOCK_CONTESTANTS.filter(contestant => {
    const matchesSearch = contestant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contestant.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contestant.nic.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || contestant.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header & Back Button */}
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="p-2 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-red-900/30 text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">School Profile</h2>
            <p className="text-sm text-white/40 mt-1">Viewing details for <span className="text-white font-medium">{MOCK_SCHOOL_DETAILS.name}</span></p>
          </div>
        </div>

        {/* School Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl p-6 sm:p-8 shadow-lg shadow-black/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Building2 className="w-32 h-32 text-white" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 relative z-10">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#141414] rounded-2xl flex items-center justify-center border border-red-900/30 shrink-0">
                <span className="text-3xl font-bold text-white/20">RC</span>
              </div>
              
              <div className="space-y-4 flex-1">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-2xl font-bold text-white">{MOCK_SCHOOL_DETAILS.name}</h3>
                    <StatusBadge status={MOCK_SCHOOL_DETAILS.status} />
                  </div>
                  <p className="text-white/60 flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-white/40" />
                    {MOCK_SCHOOL_DETAILS.address}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-8 h-8 rounded-lg bg-[#141414] border border-red-900/30 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-white/60" />
                    </div>
                    {MOCK_SCHOOL_DETAILS.email}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-8 h-8 rounded-lg bg-[#141414] border border-red-900/30 flex items-center justify-center">
                      <Phone className="w-4 h-4 text-white/60" />
                    </div>
                    {MOCK_SCHOOL_DETAILS.phone}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl p-6 flex items-center justify-between group hover:border-red-900/50 transition-colors shadow-lg shadow-black/50">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Total Entries</p>
                <p className="text-3xl font-bold text-white">{MOCK_SCHOOL_DETAILS.totalEntries}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <Trophy className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl p-6 flex items-center justify-between group hover:border-red-900/50 transition-colors shadow-lg shadow-black/50">
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Registration Date</p>
                <p className="text-lg font-bold text-white">{MOCK_SCHOOL_DETAILS.registeredDate}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Contestants Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-white">Registered Contestants</h3>
            <div className="flex gap-2">
               <button className="px-4 py-2 bg-[#141414] hover:bg-[#1a1a1a] text-white text-sm font-medium rounded-xl border border-red-900/30 transition-all flex items-center gap-2 shadow-lg shadow-black/50">
                <Download className="w-4 h-4" />
                Export List
              </button>
            </div>
          </div>

          <SearchFilterBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedFilter={selectedCategory}
            setSelectedFilter={setSelectedCategory}
            filterOptions={CATEGORIES}
            searchPlaceholder="Search students..."
            filterLabel="Category"
          />

          {/* Table */}
          <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl overflow-hidden shadow-lg shadow-black/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#141414]/80">
                  <tr className="border-b border-red-900/30">
                    <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Contest ID</th>
                    <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Student Name</th>
                    <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Mobile</th>
                    <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">NIC</th>
                    <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-900/30">
                  {filteredContestants.length > 0 ? (
                    filteredContestants.map((contestant) => (
                      <tr key={contestant.id} className="group hover:bg-[#141414]/50 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-white/40 group-hover:text-white/60">
                          {contestant.id}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          {contestant.name}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#141414] border border-red-900/30 text-xs text-white/70">
                            {contestant.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-white/60 font-mono">
                          {contestant.mobile}
                        </td>
                        <td className="px-6 py-4 text-sm text-white/60 font-mono">
                          {contestant.nic}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <ActionButton type="delete" title="Delete Entry" />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-white/20 text-sm">
                        No contestants found for this school matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination 
              currentPage={1} 
              totalPages={1} 
              onPageChange={() => {}} 
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
