import { createClient } from '@supabase/supabase-js';
import { secureLogger } from './secureLogs';
import { customStorageAdapter } from './customStorageAdapter';

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  const missingVars = [];
  if (!SUPABASE_URL) missingVars.push('VITE_SUPABASE_URL');
  if (!SUPABASE_ANON_KEY) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  const errorMsg = `Missing required Supabase environment variables: ${missingVars.join(', ')}. Please check your .env file.`;
  secureLogger.error('Supabase environment validation failed', { missing: missingVars });
  throw new Error(errorMsg);
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: customStorageAdapter, // Use custom adapter for "Remember Me"
  },
});
