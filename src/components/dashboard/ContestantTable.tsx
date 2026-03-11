import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

interface Contestant {
  id: number;
  name: string;
  contestantId: string;
  category: string;
  mobile: string;
  nic: string;
}

interface ContestantTableProps {
  contestants: Contestant[];
}

export default function ContestantTable({ contestants }: ContestantTableProps) {
  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl overflow-hidden shadow-xl shadow-black/50">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-red-900/30">
          <thead className="bg-[#141414]/80">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-medium text-zinc-400 uppercase tracking-wider font-mono">
                No
              </th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-medium text-zinc-400 uppercase tracking-wider font-mono">
                Contestant Name
              </th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-medium text-zinc-400 uppercase tracking-wider font-mono">
                Contestant ID
              </th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-medium text-zinc-400 uppercase tracking-wider font-mono">
                Category
              </th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-medium text-zinc-400 uppercase tracking-wider font-mono">
                Mobile Number
              </th>
              <th scope="col" className="px-6 py-4 text-left text-[10px] font-medium text-zinc-400 uppercase tracking-wider font-mono">
                ID Number
              </th>
              <th scope="col" className="relative px-6 py-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-red-900/30 bg-transparent">
            {contestants.length > 0 ? (
              contestants.map((person, index) => (
                <motion.tr 
                  key={person.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[#141414]/50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-400 font-mono">
                    {(index + 1).toString().padStart(2, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-[#141414] flex items-center justify-center text-xs font-medium text-zinc-300 mr-3 border border-red-900/30">
                        {person.name.charAt(0)}
                      </div>
                      <div className="text-sm font-medium text-zinc-50 group-hover:text-white transition-all">
                        {person.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-zinc-300 font-mono bg-[#141414]/50 rounded-md">
                    {person.contestantId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#141414] text-zinc-200 border border-red-900/30">
                      {person.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400 font-mono">
                    {person.mobile}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400 font-mono">
                    {person.nic}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-zinc-400 hover:text-zinc-50 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-zinc-400 text-sm">
                  No contestants found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
