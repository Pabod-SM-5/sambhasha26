import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap } from 'lucide-react';

export default function AgeCategories() {
  const ageCategories = [
    {
      title: "Junior Category",
      grades: "Grade 6, 7, 8",
      icon: <GraduationCap className="w-6 h-6 text-white/80" />,
      border: "border-red-900/30"
    },
    {
      title: "Intermediate Category",
      grades: "Grade 9, 10, 11",
      icon: <GraduationCap className="w-6 h-6 text-white/80" />,
      border: "border-red-900/30"
    },
    {
      title: "Senior Category",
      grades: "Grade 12, 13",
      icon: <GraduationCap className="w-6 h-6 text-white/80" />,
      border: "border-red-900/30"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {ageCategories.map((category, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`relative overflow-hidden rounded-2xl border ${category.border} bg-[#0a0a0a]/80 backdrop-blur-md p-6 group hover:border-red-900/50 transition-all duration-300`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col items-center text-center space-y-4 relative z-10">
            <div className="p-3 rounded-full bg-[#141414] border border-red-900/30 group-hover:bg-[#1a1a1a] group-hover:scale-110 transition-all duration-300">
              {category.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">{category.title}</h3>
              <p className="text-white/40 font-mono text-sm">{category.grades}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
