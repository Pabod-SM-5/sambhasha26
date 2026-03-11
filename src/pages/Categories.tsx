import React from 'react';
import { motion } from 'motion/react';
import { Layers, Users } from 'lucide-react';

// Mock Data for Categories
const CATEGORIES_DATA = [
  { id: 1, number: "01", name: "Announcing", ageGroups: ["Junior", "Intermediate", "Senior"] },
  { id: 2, number: "02", name: "Debating", ageGroups: ["Senior"] },
  { id: 3, number: "03", name: "Creative Writing", ageGroups: ["Junior", "Intermediate", "Senior"] },
  { id: 4, number: "04", name: "News Reporting", ageGroups: ["Intermediate", "Senior"] },
  { id: 5, number: "05", name: "Photography", ageGroups: ["Open"] },
  { id: 6, number: "06", name: "Short Film", ageGroups: ["Open"] },
  { id: 7, number: "07", name: "Graphic Design", ageGroups: ["Open"] },
  { id: 8, number: "08", name: "Dubbing", ageGroups: ["Intermediate", "Senior"] },
];

export default function Categories() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-medium text-white tracking-tight">Categories</h1>
          <p className="text-white/40 text-sm mt-1">View all competition categories and age groups</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl overflow-hidden shadow-xl shadow-black/50">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-red-900/30">
            <thead className="bg-[#141414]/80">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-[10px] font-medium text-white/40 uppercase tracking-wider font-mono w-24">
                  Category No
                </th>
                <th scope="col" className="px-6 py-4 text-left text-[10px] font-medium text-white/40 uppercase tracking-wider font-mono">
                  Category Name
                </th>
                <th scope="col" className="px-6 py-4 text-left text-[10px] font-medium text-white/40 uppercase tracking-wider font-mono">
                  Age Group Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-900/30 bg-transparent">
              {CATEGORIES_DATA.map((category, index) => (
                <motion.tr 
                  key={category.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[#141414]/50 transition-colors group"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-lg bg-[#141414] flex items-center justify-center text-xs font-mono text-white/60 border border-red-900/30 group-hover:border-red-900/50 transition-colors">
                        {category.number}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-[#141414] text-white/40 group-hover:text-white/80 transition-colors">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                        {category.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {category.ageGroups.map((group) => (
                        <span 
                          key={group} 
                          className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-medium border ${
                            group === 'Open' 
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                              : 'bg-[#141414] text-white/60 border-red-900/30'
                          }`}
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
