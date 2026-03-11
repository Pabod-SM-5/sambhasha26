import React from 'react';
import { Eye, Trash2, Edit2, Ban, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActionButtonProps {
  type: 'view' | 'edit' | 'delete' | 'ban' | 'download';
  onClick?: () => void;
  to?: string;
  title?: string;
}

export default function ActionButton({ type, onClick, to, title }: ActionButtonProps) {
  const getIcon = () => {
    switch (type) {
      case 'view': return <Eye className="w-4 h-4" />;
      case 'edit': return <Edit2 className="w-4 h-4" />;
      case 'delete': return <Trash2 className="w-4 h-4" />;
      case 'ban': return <Ban className="w-4 h-4" />;
      case 'download': return <Download className="w-4 h-4" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'delete': return 'hover:bg-red-500/10 text-red-500/60 hover:text-red-500';
      case 'ban': return 'hover:bg-amber-500/10 text-amber-500/60 hover:text-amber-500';
      case 'edit': return 'hover:bg-blue-500/10 text-blue-500/60 hover:text-blue-500';
      default: return 'hover:bg-[#141414] text-white/60 hover:text-white';
    }
  };

  if (to) {
    return (
      <Link 
        to={to}
        title={title}
        className={`p-2 rounded-lg transition-colors ${getStyles()}`}
      >
        {getIcon()}
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${getStyles()}`}
    >
      {getIcon()}
    </button>
  );
}
