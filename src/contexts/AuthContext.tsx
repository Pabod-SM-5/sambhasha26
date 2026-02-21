import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { secureLogger } from '../lib/secureLogs';

interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'user';
  status?: 'active' | 'inactive';
  school_id?: string;
  school_name?: string;
  logo_url?: string | null;
  phone?: string;
  address?: string;
  district?: string;
  tic_name?: string;
  tic_contact?: string;
  coordinator_name?: string;
  coordinator_contact?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  role: 'admin' | 'user' | null;
  loading: boolean;
  profile: UserProfile | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  role: null,
  loading: true,
  profile: null,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileFetchInProgress, setProfileFetchInProgress] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check active session (v2 syntax)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // 2. Listen for auth changes (v2 syntax)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'PASSWORD_RECOVERY') {
        navigate('/update-password');
      }

      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setRole(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    // Prevent concurrent profile fetches
    if (profileFetchInProgress) {
      return;
    }
    
    setProfileFetchInProgress(true);
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        secureLogger.error('Error fetching profile', { code: error.code });
        setLoading(false);
        setProfileFetchInProgress(false);
        return;
      }
      
      if (data) {
        const typedProfile: UserProfile = {
          id: data.id,
          email: data.email,
          role: data.role || 'user',
          status: data.status,
          school_id: data.school_id,
          school_name: data.school_name,
          logo_url: data.logo_url,
          phone: data.phone,
          address: data.address,
          district: data.district,
          tic_name: data.tic_name,
          tic_contact: data.tic_contact,
          coordinator_name: data.coordinator_name,
          coordinator_contact: data.coordinator_contact,
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        setProfile(typedProfile);
        setRole(typedProfile.role);
      }
    } catch (err) {
      secureLogger.error('Profile fetch exception', { errorType: (err as Error)?.name });
    } finally {
      setLoading(false);
      setProfileFetchInProgress(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        secureLogger.error('Sign out error', { code: error.code });
      }
      setSession(null);
      setUser(null);
      setRole(null);
      setProfile(null);
    } catch (err) {
      secureLogger.error('Sign out exception', { errorType: (err as Error)?.name });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, role, loading, profile, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);