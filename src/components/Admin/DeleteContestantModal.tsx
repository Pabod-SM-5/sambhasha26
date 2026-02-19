import React from 'react';
import { AlertTriangle, X, Trash2, UserMinus } from 'lucide-react';

interface DeleteContestantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  contestantName: string;
  isDeleting: boolean;
}

const DeleteContestantModal: React.FC<DeleteContestantModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  contestantName, 
  isDeleting 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
        onClick={isDeleting ? undefined : onClose} 
      />

      {/* Modal Content */}
      <div className="relative bg-dark-card border border-red-500/30 w-full max-w-md rounded-2xl shadow-[0_0_50px_rgba(220,38,38,0.2)] overflow-hidden animate-zoom-in-95">
        
        {/* Header */}
        <div className="bg-red-500/10 border-b border-red-500/20 p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                <UserMinus size={32} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Remove Contestant</h2>
            <p className="text-[10px] text-red-400 font-mono mt-1">CONFIRM DELETION PROTOCOL</p>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
            <div className="text-center space-y-4">
                <p className="text-sm text-neutral-300 leading-relaxed">
                    You are removing the following entry from the Global Registry:
                </p>
                <div className="bg-dark-950 border border-neutral-800 p-4 rounded-lg">
                    <span className="text-lg font-mono font-bold text-white block">{contestantName}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-[10px] text-red-500 font-mono bg-red-950/20 p-2 rounded">
                    <AlertTriangle size={12} />
                    <span>THIS ACTION CANNOT BE UNDONE</span>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button 
                    onClick={onClose}
                    disabled={isDeleting}
                    className="flex-1 py-3.5 bg-dark-800 hover:bg-dark-700 text-neutral-300 text-xs font-bold uppercase tracking-widest rounded-xl transition-colors border border-neutral-700"
                >
                    Cancel
                </button>
                <button 
                    onClick={onConfirm}
                    disabled={isDeleting}
                    className="flex-1 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2"
                >
                    {isDeleting ? (
                        <span className="animate-pulse">Processing...</span>
                    ) : (
                        <>
                            <Trash2 size={16} /> Delete Entry
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* Close X */}
        {!isDeleting && (
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
            >
                <X size={20} />
            </button>
        )}
      </div>
    </div>
  );
};

export default DeleteContestantModal;