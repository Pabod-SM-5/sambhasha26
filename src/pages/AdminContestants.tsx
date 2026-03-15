import React, { useState } from 'react';
import AdminLayout from '../components/Admin/AdminLayout';
import { Download } from 'lucide-react';
import ActionButton from '../components/Admin/ui/ActionButton';
import Pagination from '../components/Admin/ui/Pagination';

// Mock Data
const MOCK_CONTESTANTS = [
  { id: 'C001', name: 'Kasun Perera', school: 'Royal College', category: 'Software', mobile: '0771234567', nic: '200512345678', status: 'Pending' },
  { id: 'C002', name: 'Amal Silva', school: 'Ananda College', category: 'Robotics', mobile: '0719876543', nic: '200698765432', status: 'Approved' },
  { id: 'C003', name: 'Nimali Fernando', school: 'Visakha Vidyalaya', category: 'Creative', mobile: '0765554443', nic: '200555544433', status: 'Rejected' },
  { id: 'C004', name: 'Ruwan Dissanayake', school: 'D.S. Senanayake College', category: 'Software', mobile: '0701112223', nic: '200611122233', status: 'Approved' },
  { id: 'C005', name: 'Saman Kumara', school: 'Isipathana College', category: 'Research', mobile: '0789998887', nic: '200599988877', status: 'Pending' },
  { id: 'C006', name: 'Dilshan Bandara', school: 'Trinity College', category: 'Robotics', mobile: '0753332221', nic: '200633322211', status: 'Approved' },
  { id: 'C007', name: 'Kavindi Perera', school: 'Musaeus College', category: 'Creative', mobile: '0726667778', nic: '200566677788', status: 'Pending' },
  { id: 'C008', name: 'Tharindu Jayasooriya', school: 'Richmond College', category: 'Software', mobile: '0744445556', nic: '200644455566', status: 'Rejected' },
];

const CATEGORIES = ['All', 'Software', 'Robotics', 'Creative', 'Research'];

export default function AdminContestants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Filter Logic
  const filteredContestants = MOCK_CONTESTANTS.filter(contestant => {
    const matchesSearch = contestant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contestant.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contestant.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          contestant.nic.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || contestant.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Current Count based on selection
  const currentCount = filteredContestants.length;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Contestants Management</h2>
            <p className="text-sm text-white/40 mt-1">Manage and review all student submissions</p>
          </div>
          <button className="px-4 py-2 bg-[#141414] hover:bg-[#1a1a1a] text-white text-sm font-medium rounded-xl border border-red-900/30 transition-all flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-black/50">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>

        {/* Single Stat Card */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl p-6 relative overflow-hidden shadow-lg shadow-black/50">
          <div className="text-sm text-white/40 uppercase tracking-wider font-bold mb-1">
            {selectedCategory === 'All' ? 'Total Entries' : `${selectedCategory} Entries`}
          </div>
          <div className="text-4xl font-bold text-white">{currentCount}</div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 bg-[#0a0a0a]/80 backdrop-blur-md p-4 rounded-2xl border border-red-900/30 shadow-lg shadow-black/50">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-4 w-4 text-white/40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by ID, name, school, or NIC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-red-900/30 rounded-xl leading-5 bg-[#141414]/50 text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-red-900/50 focus:border-red-900/50 sm:text-sm transition-colors"
            />
          </div>
          <div className="sm:w-64 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-white bg-[#141414]/50 border border-red-900/30 focus:outline-none focus:ring-1 focus:ring-red-900/50 focus:border-red-900/50 sm:text-sm rounded-xl appearance-none cursor-pointer transition-colors"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category} className="bg-[#1a1a1a] text-white">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl overflow-hidden shadow-lg shadow-black/50">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#141414]/80">
                <tr className="border-b border-red-900/30">
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Contest ID</th>
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">School</th>
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Mobile Number</th>
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
                      <td className="px-6 py-4 text-xs text-white/60">
                        {contestant.school}
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
                          <ActionButton type="view" title="View Details" />
                          <ActionButton type="delete" title="Delete Entry" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-white/20 text-sm">
                      No contestants found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <Pagination 
            currentPage={1} 
            totalPages={1} 
            onPageChange={() => {}} 
          />
        </div>
      </div>
    </AdminLayout>
  );
}
