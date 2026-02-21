/**
 * Custom Storage Adapter for Supabase
 * Implements dynamic "Remember Me" persistence strategy.
 * 
 * Strategy:
 * 1. "Remember Me" preference is saved in localStorage (REMEMBER_ME_KEY).
 * 2. setItem: Checks preference. 
 *    - If true: Saves to localStorage (persistent).
 *    - If false: Saves to sessionStorage (cleared on browser close).
 * 3. getItem: Checks localStorage first, then sessionStorage.
 * 4. removeItem: Clears from both to ensure clean logout.
 */

const REMEMBER_ME_KEY = 'SUPABASE_REMEMBER_ME';

export const customStorageAdapter = {
  getItem: (key: string): string | null => {
    // Priority 1: Check persistent storage
    const localValue = localStorage.getItem(key);
    if (localValue) return localValue;

    // Priority 2: Check temporary storage
    return sessionStorage.getItem(key);
  },

  setItem: (key: string, value: string): void => {
    // Retrieve the user's login preference
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';

    if (rememberMe) {
      // User wants to be remembered -> Persistent Storage
      localStorage.setItem(key, value);
      // Clean up duplicate in session to avoid state confusion
      sessionStorage.removeItem(key);
    } else {
      // User does NOT want to be remembered -> Session Storage
      sessionStorage.setItem(key, value);
      // Clean up persistent storage to respect privacy
      localStorage.removeItem(key);
    }
  },

  removeItem: (key: string): void => {
    // Security: Wipe traces from all storage mediums
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
};

/**
 * Helper to set the user's persistence preference.
 * Call this BEFORE supabase.auth.signInWithPassword.
 */
export const setRememberMePreference = (shouldRemember: boolean) => {
  localStorage.setItem(REMEMBER_ME_KEY, String(shouldRemember));
};
