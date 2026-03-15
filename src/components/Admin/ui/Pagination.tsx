import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="px-6 py-4 border-t border-red-900/30 bg-[#0a0a0a]/50 flex items-center justify-between text-xs text-white/40">
      <span>Showing {currentPage} of {totalPages} pages</span>
      <div className="flex gap-1">
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 hover:bg-[#141414] rounded-lg disabled:opacity-50 transition-colors"
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1.5 rounded-lg transition-colors outline-none focus:outline-none ${
              currentPage === page ? 'bg-[#141414] text-white border border-red-900/30' : 'hover:bg-[#141414] border border-transparent'
            }`}
          >
            {page}
          </button>
        ))}
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 hover:bg-[#141414] rounded-lg disabled:opacity-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
