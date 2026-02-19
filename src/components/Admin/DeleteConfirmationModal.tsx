import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  schoolName: string;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  schoolName, 
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
                <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">Critical Action</h2>
            <p className="text-[10px] text-red-400 font-mono mt-1">PERMANENT DATA DESTRUCTION</p>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
            <div className="text-center space-y-4">
                <p className="text-sm text-neutral-300 leading-relaxed">
                    You are about to delete the account for:
                </p>
                <div className="bg-dark-950 border border-neutral-800 p-3 rounded-lg">
                    <span className="text-lg font-mono font-bold text-white">{schoolName}</span>
                </div>
                <p className="text-xs text-neutral-500">
                    This action will permanently remove the <span className="text-red-400">School Profile</span>, <span className="text-red-400">Logo</span>, and <span className="text-red-400">ALL Registered Competitors</span> associated with this account.
                </p>
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
                        <span className="animate-pulse">Deleting...</span>
                    ) : (
                        <>
                            <Trash2 size={16} /> Confirm Delete
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* Close X (Optional) */}
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

export default DeleteConfirmationModal;