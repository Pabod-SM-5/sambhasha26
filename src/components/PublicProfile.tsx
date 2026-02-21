import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { secureLogger } from '../lib/secureLogs';
import { Building, MapPin, Mail, Phone, Loader2, AlertTriangle } from 'lucide-react';

interface PublicProfileData {
  school_name: string;
  logo_url: string | null;
  district: string;
  address: string;
  email: string;
  phone: string;
  coordinator_name: string;
  tic_name: string;
}

const PublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;

      try {
        setLoading(true);
        // Decode URL param just in case
        const decodedName = decodeURIComponent(username).replace(/-/g, ' '); // Simple de-slugify if needed, or just raw
        
        // Try to find by school_name (case insensitive)
        // Note: In a real app with "username", we'd query a unique username column.
        // Here we try to fuzzy match school_name for the demo requirement.
        const { data, error } = await supabase
          .from('profiles')
          .select('school_name, logo_url, district, address, email, phone, coordinator_name, tic_name')
          .ilike('school_name', decodedName)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          setError('User not found');
        } else {
          setProfile(data);
        }
      } catch (err) {
        secureLogger.error('Public Profile Load Error', { error: err });
        setError('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center text-silver-accent">
        <Loader2 className="animate-spin mr-2" /> Loading Profile...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-neutral-400 space-y-4">
        <AlertTriangle size={48} className="text-red-500/50" />
        <h1 className="text-xl font-bold text-white">Profile Not Found</h1>
        <p>The user "{username}" does not exist or is unavailable.</p>
        <Link to="/" className="text-silver-accent hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white font-sans p-6 md:p-12 flex justify-center">
      <div className="max-w-3xl w-full space-y-8 animate-slide-up">
        
        {/* Header Card */}
        <div className="bg-dark-card border border-neutral-800 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-silver-500/0 via-silver-500/50 to-silver-500/0" />
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-32 h-32 rounded-2xl bg-dark-800 border-2 border-neutral-700 flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
                    {profile.logo_url ? (
                        <img src={profile.logo_url} alt={profile.school_name} className="w-full h-full object-contain" />
                    ) : (
                        <Building size={48} className="text-neutral-600" />
                    )}
                </div>
                
                <div className="text-center md:text-left space-y-2 flex-1">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-silver-accent/10 border border-silver-accent/20 text-silver-accent text-[10px] font-bold uppercase tracking-widest mb-2">
                        Participating School
                    </div>
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-wide">
                        {profile.school_name}
                    </h1>
                    <p className="text-neutral-400 font-medium flex items-center justify-center md:justify-start gap-2">
                        <MapPin size={14} /> {profile.address}
                    </p>
                </div>
            </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">Contact Information</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-neutral-400">
                            <Mail size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-neutral-500 font-bold">Official Email</p>
                            <a href={`mailto:${profile.email}`} className="text-sm text-silver-accent hover:underline">{profile.email}</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-neutral-400">
                            <Phone size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-neutral-500 font-bold">Phone</p>
                            <p className="text-sm text-silver-accent">{profile.phone || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-dark-900/50 border border-neutral-800 rounded-2xl p-6 hover:border-neutral-700 transition-colors">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-4">School Details</h3>
                 <div className="space-y-4">
                    <div>
                        <p className="text-[10px] uppercase text-neutral-500 font-bold mb-1">District</p>
                        <p className="text-sm text-white font-medium">{profile.district}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] uppercase text-neutral-500 font-bold mb-1">Coordinator</p>
                            <p className="text-xs text-white">{profile.coordinator_name || 'N/A'}</p>
                        </div>
                        <div>
                             <p className="text-[10px] uppercase text-neutral-500 font-bold mb-1">TIC</p>
                             <p className="text-xs text-white">{profile.tic_name || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="text-center pt-8">
            <Link to="/login" className="text-neutral-500 text-xs hover:text-white transition-colors uppercase tracking-widest">
                Login to Portal
            </Link>
        </div>

      </div>
    </div>
  );
};

export default PublicProfile;
