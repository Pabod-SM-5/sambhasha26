import React, { useState } from 'react';
import AdminLayout from '../components/Admin/AdminLayout';
import { Power, Clipboard, ExternalLink, AlertTriangle, CheckCircle } from 'lucide-react';

// Mock Data for Submissions
const MOCK_SUBMISSIONS = [
  { id: 'NC-SM-24-001', name: 'Kasun Perera', school: 'Royal College', category: '1 - Software', link: 'https://drive.google.com/file/d/...' },
  { id: 'NC-SM-24-002', name: 'Amal Silva', school: 'Ananda College', category: '3 - Robotics', link: 'https://github.com/amal/robot' },
  { id: 'NC-SM-24-003', name: 'Nimali Fernando', school: 'Visakha Vidyalaya', category: '5 - Creative', link: 'https://behance.net/nimali' },
  { id: 'NC-SM-24-004', name: 'Ruwan Dissanayake', school: 'D.S. Senanayake', category: '1 - Software', link: 'https://demo.app.com' },
  { id: 'NC-SM-24-005', name: 'Saman Kumara', school: 'Isipathana College', category: '7 - Research', link: 'https://docs.google.com/...' },
];

export default function AdminOther() {
  const [isRegistrationActive, setIsRegistrationActive] = useState(true);

  const toggleRegistration = () => {
    setIsRegistrationActive(!isRegistrationActive);
  };

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Page Header */}
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Control & Submissions</h2>
          <p className="text-sm text-white/40 mt-1">Manage competition flow and monitor digital assets</p>
        </div>

        {/* Registration Control Card */}
        <div className={`border rounded-2xl p-4 sm:p-6 transition-all backdrop-blur-md shadow-lg shadow-black/50 ${isRegistrationActive ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-4">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${isRegistrationActive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                <Power className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">Registration Status</h3>
                <p className="text-xs sm:text-sm text-white/60 mt-1 sm:mt-0">
                  {isRegistrationActive 
                    ? 'Competition registration is currently ACTIVE.' 
                    : 'Competition registration is PAUSED.'}
                </p>
              </div>
            </div>
            <button 
              onClick={toggleRegistration}
              className={`w-full sm:w-auto px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all ${
                isRegistrationActive 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              }`}
            >
              {isRegistrationActive ? 'Pause Registration' : 'Resume Registration'}
            </button>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl overflow-hidden shadow-lg shadow-black/50">
          <div className="px-6 py-4 border-b border-red-900/30 flex items-center justify-between bg-[#141414]/50">
            <h3 className="text-sm font-semibold text-white">Digital Submissions Showcase</h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-[#141414] border border-red-900/30 text-xs text-white/40">
                Live Feed
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#141414]/80">
                <tr className="border-b border-red-900/30">
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Contestant ID</th>
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">School</th>
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-medium text-white/40 uppercase tracking-wider">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-900/30">
                {MOCK_SUBMISSIONS.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-[#141414]/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-white/40 group-hover:text-white/60">
                      {sub.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {sub.name}
                    </td>
                    <td className="px-6 py-4 text-xs text-white/60">
                      {sub.school}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-[#141414] border border-red-900/30 text-xs text-white/70">
                        {sub.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-blue-400 hover:text-blue-300">
                      <a href={sub.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                        View Asset <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
