/**
 * Client-side Rate Limiting Utility
 * Prevents abuse of operations like login, registration, uploads
 * 
 * IMPORTANT: This is CLIENT-SIDE validation only!
 * Add SERVER-SIDE rate limiting in production:
 * - Implement rate limiting at API/RPC level
 * - Use IP-based and user-based rate limits
 * - Store attempts in database, not memory
 * - Implement exponential backoff on server
 * - Return 429 Too Many Requests on server
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();

  /**
   * Check if an action is rate limited
   * @param key Unique identifier (e.g., 'login_user@email.com')
   * @param maxAttempts Maximum attempts allowed
   * @param windowMs Time window in milliseconds
   * @returns true if action is allowed, false if rate limited
   */
  isAllowed(key: string, maxAttempts: number, windowMs: number): boolean {
    // Zero or negative max attempts should always be denied
    if (maxAttempts <= 0) {
      return false;
    }

    const now = Date.now();
    const entry = this.limits.get(key);

    // No entry or time window has passed - reset
    if (!entry || now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    // Check if limit exceeded
    if (entry.count >= maxAttempts) {
      return false;
    }

    // Increment counter
    entry.count++;
    return true;
  }

  /**
   * Get remaining attempts
   */
  getRemainingAttempts(key: string, maxAttempts: number): number {
    const entry = this.limits.get(key);
    if (!entry) return maxAttempts;
    
    const now = Date.now();
    if (now > entry.resetTime) {
      return maxAttempts;
    }

    return Math.max(0, maxAttempts - entry.count);
  }

  /**
   * Get reset time for a key
   */
  getResetTime(key: string): number | null {
    const entry = this.limits.get(key);
    return entry?.resetTime ?? null;
  }

  /**
   * Clear a specific key
   */
  clear(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Clear all entries
   */
  clearAll(): void {
    this.limits.clear();
  }

  /**
   * Get time remaining until reset (in seconds)
   */
  getSecondsUntilReset(key: string): number {
    const resetTime = this.getResetTime(key);
    if (!resetTime) return 0;
    
    const now = Date.now();
    const remaining = Math.max(0, resetTime - now);
    return Math.ceil(remaining / 1000);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Pre-configured rate limiters for common operations
 */
export const rateLimits = {
  // Login: 5 attempts per 15 minutes
  login: (email: string) => ({
    key: `login_${email}`,
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000,
  }),

  // Registration: 3 attempts per 1 hour
  registration: (email: string) => ({
    key: `register_${email}`,
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
  }),

  // File upload: 10 uploads per 1 hour
  fileUpload: (userId: string) => ({
    key: `upload_${userId}`,
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000,
  }),

  // Add competitor: 50 per 1 hour
  addCompetitor: (schoolId: string) => ({
    key: `competitor_${schoolId}`,
    maxAttempts: 50,
    windowMs: 60 * 60 * 1000,
  }),

  // Password reset: 3 per 1 hour
  passwordReset: (email: string) => ({
    key: `reset_${email}`,
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000,
  }),
};

export { RateLimiter };
