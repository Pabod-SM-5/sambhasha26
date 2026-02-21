import { supabase } from './supabaseClient';
import { secureLogger } from './secureLogs';

export const logSystemAction = async (action: string, details: string): Promise<void> => {
  try {
    // ========== SECURITY: GET CURRENT USER ==========
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      secureLogger.error('Failed to get user for logging', { code: userError.code });
      return;
    }
    
    // ========== SECURITY: IP LOGGING NOTE ==========
    // WARNING: Fetching IP from external API has privacy implications.
    // Consider:
    // 1. Get IP from backend (more reliable and secure)
    // 2. Implement proper GDPR consent
    // 3. Use a privacy-focused logging service
    // For now, we use 'Client' as placeholder.
    
    const ipAddress = 'Client';

    if (user) {
      const { error } = await supabase.from('system_logs').insert([{
        user_email: user.email,
        action: action,
        details: details,
        ip_address: ipAddress,
        timestamp: new Date().toISOString()
      }]);

      if (error) {
        secureLogger.error('System logging failed', { code: error.code });
      }
    }
  } catch (error) {
    // Don't throw error to prevent blocking main user actions
    secureLogger.error('System logging error', { errorType: (error as Error)?.name });
  }
};