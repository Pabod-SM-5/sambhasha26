import React, { useState } from 'react';
import { X, User, Building, MapPin, Mail, Shield, Key, AlertCircle, CheckCircle, Smartphone } from 'lucide-react';
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
        setMessage({ type: 'error', text: 'Please fill in all fields.' });
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
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;
        
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
        className="absolute inset-0 bg-black/90 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative bg-dark-card border border-dark-700 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-dark-700 bg-dark-card/50 backdrop-blur-sm z-10">
          <h2 className="text-sm font-bold tracking-[0.2em] text-silver-accent uppercase font-sans">
            Profile & Settings
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-dark-700 text-neutral-500 hover:text-white transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto custom-scrollbar flex-1 p-6 md:p-8 space-y-8">
          
          {/* Identity Section */}
          <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-dark-700/50">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-dark-800 border border-dark-700 p-2 shadow-lg flex-shrink-0">
              {profile.logo_url && !imgError ? (
                <img 
                  src={profile.logo_url} 
                  alt="School Crest" 
                  className="w-full h-full object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-dark-700">
                  <Building size={32} />
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left space-y-2">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-wide">
                {profile.school_name}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Badge label={`ID: ${profile.school_id}`} />
                <Badge label={profile.district} />
                <Badge label="Participating School" variant="accent" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column: Read-Only Info */}
            <div className="space-y-8">
              
              {/* School Details */}
              <Section title="School Details" icon={<Building size={14} />}>
                <ReadOnlyField 
                  label="Address" 
                  value={profile.address} 
                  icon={<MapPin size={14} />} 
                />
                <ReadOnlyField 
                  label="Official Email" 
                  value={user?.email || 'N/A'} 
                  icon={<Mail size={14} />} 
                />
              </Section>

              {/* Coordinator Details */}
              <Section title="Coordinator Details" icon={<User size={14} />}>
                <div className="grid grid-cols-1 gap-4">
                   <ReadOnlyField 
                    label="Name" 
                    value={profile.coordinator_name || 'N/A'} 
                  />
                  <ReadOnlyField 
                    label="Contact Number" 
                    value={profile.coordinator_contact || 'N/A'} 
                    icon={<Smartphone size={14} />}
                  />
                </div>
              </Section>

              {/* TIC Details */}
              <Section title="Teacher-in-Charge Details" icon={<User size={14} />}>
                 <div className="grid grid-cols-1 gap-4">
                   <ReadOnlyField 
                    label="Name" 
                    value={profile.tic_name || 'N/A'} 
                  />
                  <ReadOnlyField 
                    label="Contact Number" 
                    value={profile.tic_contact || 'N/A'} 
                    icon={<Smartphone size={14} />}
                  />
                </div>
              </Section>
            </div>

            {/* Right Column: Security (Functional) */}
            <div className="space-y-8">
               <Section title="Security & Access" icon={<Shield size={14} />}>
                  <div className="bg-dark-800/30 rounded-2xl p-6 border border-dark-700/50 space-y-6">
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-white flex items-center gap-2">
                            <Key size={16} className="text-silver-accent" />
                            Update Password
                        </h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                            Ensure your account uses a strong, unique password to maintain security.
                        </p>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs font-medium animate-fade-in ${
                            message.type === 'error' 
                            ? 'bg-red-500/5 border-red-500/20 text-red-400' 
                            : 'bg-green-500/5 border-green-500/20 text-green-400'
                        }`}>
                            {message.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 ml-1">New Password</label>
                            <input 
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 ml-1">Confirm Password</label>
                            <input 
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-dark-900 border border-dark-700 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-700 focus:outline-none focus:border-silver-500/50 focus:ring-1 focus:ring-silver-500/20 transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handlePasswordChange}
                        disabled={loading}
                        className="w-full bg-white text-black hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-white/5 active:scale-[0.98]"
                    >
                        {loading ? 'Updating...' : 'Save Changes'}
                    </button>
                  </div>
               </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components for cleaner code ---

const Badge = ({ label, variant = 'default' }: { label: string, variant?: 'default' | 'accent' }) => (
  <span className={`
    px-3 py-1 rounded-full border text-[10px] uppercase tracking-wider font-bold
    ${variant === 'accent' 
      ? 'bg-silver-accent/10 border-silver-accent/20 text-silver-accent' 
      : 'bg-dark-800 border-dark-700 text-neutral-400'}
  `}>
    {label}
  </span>
);

const Section = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
  <div className="space-y-4">
    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.15em] flex items-center gap-2 pl-1">
      {icon} {title}
    </h3>
    <div className="space-y-3">
        {children}
    </div>
  </div>
);

const ReadOnlyField = ({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) => (
  <div className="group">
    <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-600 mb-1.5 ml-1 flex items-center gap-1.5">
        {label}
    </label>
    <div className="bg-dark-900/50 border border-dark-700/50 rounded-xl px-4 py-3.5 flex items-center gap-3 transition-colors group-hover:border-dark-700">
        {icon && <span className="text-neutral-600">{icon}</span>}
        <span className="text-sm text-neutral-300 font-medium truncate w-full">
            {value}
        </span>
    </div>
  </div>
);

export default SettingsModal;
