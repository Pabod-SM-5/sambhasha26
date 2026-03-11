import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export default function StatusBadge({ status, type = 'default' }: StatusBadgeProps) {
  const getStatusStyles = (status: string, type: string) => {
    // If type is explicitly provided, use it
    if (type !== 'default') {
      switch (type) {
        case 'success': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        case 'error': return 'text-red-400 bg-red-500/10 border-red-500/20';
        case 'info': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        default: return 'text-white/60 bg-[#141414] border-red-900/30';
      }
    }

    // Otherwise infer from status text
    const lowerStatus = status.toLowerCase();
    if (['approved', 'active', 'success', 'completed'].includes(lowerStatus)) {
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
    if (['rejected', 'inactive', 'error', 'failed', 'banned'].includes(lowerStatus)) {
      return 'text-red-400 bg-red-500/10 border-red-500/20';
    }
    if (['pending', 'warning', 'paused'].includes(lowerStatus)) {
      return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
    return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusStyles(status, type)}`}>
      {status}
    </span>
  );
}
