import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Ban, Trash2 } from 'lucide-react';

const MOCK_SCHOOLS = [
  { id: 'SCH001', name: 'Royal College', email: 'principal@royal.lk', entries: 45 },
  { id: 'SCH002', name: 'Ananda College', email: 'info@ananda.lk', entries: 38 },
  { id: 'SCH003', name: 'Visakha Vidyalaya', email: 'admin@visakha.lk', entries: 42 },
  { id: 'SCH004', name: 'Devi Balika Vidyalaya', email: 'office@devibalika.lk', entries: 0 },
  { id: 'SCH005', name: 'D.S. Senanayake College', email: 'contact@dssc.lk', entries: 12 },
];

export default function SchoolsTable() {
  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl overflow-hidden shadow-lg shadow-black/50">
      <div className="px-6 py-4 border-b border-red-900/30 flex items-center justify-between bg-[#141414]/50">
        <h3 className="text-sm font-semibold text-white">Registered Institutions</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium bg-[#141414] hover:bg-[#1a1a1a] text-white/80 hover:text-white rounded-lg border border-red-900/30 transition-all">
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#141414]/80">
            <tr className="border-b border-red-900/30">
              <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider w-24">ID</th>
              <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">School Name</th>
              <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider hidden sm:table-cell">Contact Email</th>
              <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider w-24 text-center">Entries</th>
              <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider w-32 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-900/30">
            {MOCK_SCHOOLS.map((school) => (
              <tr key={school.id} className="group hover:bg-[#141414]/50 transition-colors">
                <td className="px-6 py-4 text-xs font-mono text-white/40 group-hover:text-white/60 transition-colors">
                  {school.id}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-white">
                  {school.name}
                </td>
                <td className="px-6 py-4 text-xs text-white/40 hidden sm:table-cell">
                  {school.email}
                </td>
                <td className="px-6 py-4 text-sm text-white/60 text-center font-medium">
                  {school.entries}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Link 
                      to={`/admin/school/${school.id}`}
                      title="View Details"
                      className="p-2 hover:bg-[#141414] text-white/60 hover:text-white rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button 
                      title="Suspend Account"
                      className="p-2 hover:bg-amber-500/10 text-amber-500/60 hover:text-amber-500 rounded-lg transition-colors"
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                    <button 
                      title="Delete Account"
                      className="p-2 hover:bg-red-500/10 text-red-500/60 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination (Mock) */}
      <div className="px-6 py-4 border-t border-red-900/30 bg-[#0a0a0a]/50 flex items-center justify-between text-xs text-white/40">
        <span>Showing 1-5 of 142 records</span>
        <div className="flex gap-1">
          <button className="px-3 py-1.5 hover:bg-[#141414] rounded-lg disabled:opacity-50 transition-colors border border-transparent outline-none focus:outline-none" disabled>Prev</button>
          <button className="px-3 py-1.5 bg-[#141414] text-white rounded-lg transition-colors border border-red-900/30 outline-none focus:outline-none">1</button>
          <button className="px-3 py-1.5 hover:bg-[#141414] rounded-lg transition-colors border border-transparent outline-none focus:outline-none">2</button>
          <button className="px-3 py-1.5 hover:bg-[#141414] rounded-lg transition-colors border border-transparent outline-none focus:outline-none">3</button>
          <button className="px-3 py-1.5 hover:bg-[#141414] rounded-lg transition-colors border border-transparent outline-none focus:outline-none">Next</button>
        </div>
      </div>
    </div>
  );
}
