import { supabase } from './supabaseClient';

export const logSystemAction = async (action: string, details: string) => {
  try {
    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser();
    
    // 2. Get Client IP (Best effort via public API)
    let ipAddress = 'Unknown';
    try {
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipRes.json();
        if (ipData.ip) ipAddress = ipData.ip;
    } catch (e) {
        // Silent fail for IP fetch, defaulting to 'Unknown' is acceptable
    }

    if (user) {
      await supabase.from('system_logs').insert([{
        user_email: user.email,
        action: action,
        details: details,
        ip_address: ipAddress,
        timestamp: new Date().toISOString()
      }]);
    }
  } catch (error) {
    console.error("Logging failed:", error);
    // Don't throw error to prevent blocking main user actions
  }
};