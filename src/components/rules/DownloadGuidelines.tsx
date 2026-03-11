import React from 'react';
import { motion } from 'motion/react';
import { FileText, Download } from 'lucide-react';

export default function DownloadGuidelines() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="bg-[#0a0a0a]/80 backdrop-blur-md border border-red-900/30 rounded-2xl p-8 text-center max-w-md w-full hover:border-red-900/50 transition-all duration-300 group shadow-2xl shadow-black/50">
        <div className="w-20 h-20 rounded-full bg-[#141414] mx-auto flex items-center justify-center mb-6 group-hover:bg-[#1a1a1a] transition-colors border border-red-900/30 group-hover:border-red-900/50">
          <FileText className="w-8 h-8 text-white/60 group-hover:text-white transition-colors" />
        </div>
        <h3 className="text-xl font-serif font-medium text-white mb-3">Complete Competition Guidelines</h3>
        <p className="text-white/40 text-sm mb-8 leading-relaxed">
          Download the official PDF containing all rules, regulations, and detailed category requirements for Sambhasha XXVI.
        </p>
        <button className="w-full py-4 bg-[#141414] text-white border border-red-900/30 rounded-xl font-bold uppercase tracking-wider text-xs hover:bg-[#1a1a1a] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/50 hover:-translate-y-0.5">
          <Download className="w-4 h-4" />
          Download Official PDF
        </button>
      </div>
    </motion.div>
  );
}
