import React, { useState } from 'react';
import { X, User, Building, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { logSystemAction } from '../../lib/logger';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { profile, user } = useAuth();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [imgError, setImgError] = useState(false);

  const handlePasswordChange = async () => {
    setMessage(null);
    if (!newPassword || !confirmPassword) {
        setMessage({ type: 'error', text: 'Please fill in all password fields.' });
        return;
    }
    if (newPassword !== confirmPassword) {
        setMessage({ type: 'error', text: 'Passwords do not match.' });
        return;
    }
    if (newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
        return;
    }

    setLoading(true);
    try {
        // v2 syntax: auth.updateUser({ password })
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        
        // Log Action
        await logSystemAction('PASSWORD_UPDATE', 'User changed their account password');

        setMessage({ type: 'success', text: 'Password updated successfully.' });
        setNewPassword('');
        setConfirmPassword('');
    } catch (error: any) {
        setMessage({ type: 'error', text: error.message || 'Failed to update password.' });
    } finally {
        setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Card */}
      <div className="relative bg-dark-card border border-neutral-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-zoom-in-95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-800 bg-dark-900/50">
          <h3 className="text-xs font-bold tracking-[0.2em] text-silver-accent uppercase">
            Settings <span className="text-neutral-600 mx-2">/</span> Sambhasha XXVI Portal
          </h3>
          <button onClick={onClose} className="text-neutral-500 hover:text-white transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 space-y-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
          
          {/* Profile Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-neutral-800/50">
            <div className="w-20 h-20 rounded-full bg-dark-800 border-2 border-neutral-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {profile.logo_url && !imgError ? (
                    <img 
                      src={profile.logo_url} 
                      alt="School Crest" 
                      className="w-full h-full object-cover" 
                      onError={() => setImgError(true)}
                    />
                ) : (
                    <Building size={32} className="text-neutral-600" />
                )}
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-white font-sans">{profile.school_name}</h2>
              <p className="text-sm text-neutral-400 mt-1 font-medium">{profile.address}</p>
              <div className="inline-flex items-center mt-3 px-3 py-1 rounded-full bg-dark-900 border border-neutral-800">
                <p className="text-[10px] text-silver-accent uppercase tracking-wider font-bold">District: {profile.district}</p>
              </div>
            </div>
          </div>

          {/* Coordinators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div className="p-4 rounded-xl bg-dark-900/30 border border-neutral-800/50">
               <h4 className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 mb-3 flex items-center">
                  <User size={12} className="mr-2" /> Co-ordinator Details
               </h4>
               <p className="text-sm font-semibold text-neutral-200">{profile.coordinator_name || 'N/A'}</p>
               <p className="text-xs text-neutral-500 mt-1 font-mono">{profile.coordinator_contact || 'N/A'}</p>
            </div>
            <div className="p-4 rounded-xl bg-dark-900/30 border border-neutral-800/50">
               <h4 className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 mb-3 flex items-center">
                  <User size={12} className="mr-2" /> Teacher in Charge Details
               </h4>
               <p className="text-sm font-semibold text-neutral-200">{profile.tic_name || 'N/A'}</p>
               <p className="text-xs text-neutral-500 mt-1 font-mono">{profile.tic_contact || 'N/A'}</p>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Account Details</h4>
            <div>
                <label className="text-[10px] uppercase tracking-wider text-neutral-600 font-semibold ml-1 mb-1 block">Official Email</label>
                <input 
                    type="email" 
                    value={user?.email || ''}
                    disabled 
                    className="w-full bg-dark-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-500 cursor-not-allowed"
                />
            </div>
          </div>

          {/* Security Details */}
          <div className="space-y-4">
             <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Security Details</h4>
             
             {message && (
                <div className={`p-3 rounded-lg border flex items-center gap-2 text-xs ${message.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-green-500/10 border-green-500/50 text-green-400'}`}>
                    {message.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle size={14} />}
                    {message.text}
                </div>
             )}

             <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full bg-dark-900/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all placeholder-neutral-600"
                    />
                    <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        className="w-full bg-dark-900/50 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all placeholder-neutral-600"
                    />
                </div>
             </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button 
                onClick={handlePasswordChange}
                disabled={loading}
                className="w-full sm:w-auto bg-gradient-to-b from-neutral-200 to-neutral-400 hover:from-white hover:to-neutral-300 text-black px-8 py-3.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-white/5 tracking-widest uppercase border-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Change Password'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SettingsModal;