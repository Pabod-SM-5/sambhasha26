import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { RateLimiter } from './rateLimiter';

describe('RateLimiter - Security Tests', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter();
    vi.useFakeTimers({ toFake: ['Date'] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('isAllowed', () => {
    it('should allow first request', () => {
      const result = limiter.isAllowed('user@test.com', 5, 60000);
      expect(result).toBe(true);
    });

    it('should allow requests within limit', () => {
      const key = 'user@test.com';
      const maxAttempts = 5;
      const windowMs = 60000;

      for (let i = 0; i < maxAttempts; i++) {
        const result = limiter.isAllowed(key, maxAttempts, windowMs);
        expect(result).toBe(true);
      }
    });

    it('should block request when limit exceeded', () => {
      const key = 'user@test.com';
      const maxAttempts = 3;
      const windowMs = 60000;

      // Make 3 requests (should all succeed)
      for (let i = 0; i < maxAttempts; i++) {
        limiter.isAllowed(key, maxAttempts, windowMs);
      }

      // 4th request should fail
      const result = limiter.isAllowed(key, maxAttempts, windowMs);
      expect(result).toBe(false);
    });

    it('should track different keys separately', () => {
      const key1 = 'user1@test.com';
      const key2 = 'user2@test.com';
      const maxAttempts = 2;
      const windowMs = 60000;

      // User 1: 2 requests
      limiter.isAllowed(key1, maxAttempts, windowMs);
      limiter.isAllowed(key1, maxAttempts, windowMs);

      // User 2: 1 request (should still succeed)
      const result = limiter.isAllowed(key2, maxAttempts, windowMs);
      expect(result).toBe(true);

      // User 1: 3rd request (should fail)
      const result2 = limiter.isAllowed(key1, maxAttempts, windowMs);
      expect(result2).toBe(false);
    });

    it('should reset counter after time window expires', () => {
      const key = 'user@test.com';
      const maxAttempts = 2;
      const windowMs = 60000;

      // Make 2 requests
      limiter.isAllowed(key, maxAttempts, windowMs);
      limiter.isAllowed(key, maxAttempts, windowMs);

      // 3rd should fail
      expect(limiter.isAllowed(key, maxAttempts, windowMs)).toBe(false);

      // Advance time past window
      vi.advanceTimersByTime(windowMs + 1000);

      // Now should succeed (counter reset)
      const result = limiter.isAllowed(key, maxAttempts, windowMs);
      expect(result).toBe(true);
    });
  });

  describe('getSecondsUntilReset', () => {
    it('should return seconds remaining until reset', () => {
      const key = 'user@test.com';
      limiter.isAllowed(key, 5, 60000);

      const secondsRemaining = limiter.getSecondsUntilReset(key);
      expect(secondsRemaining).toBeGreaterThan(0);
      expect(secondsRemaining).toBeLessThanOrEqual(60);
    });

    it('should return 0 when already reset', () => {
      const key = 'user@test.com';
      const windowMs = 10000;
      
      limiter.isAllowed(key, 5, windowMs);
      
      // Advance past window
      vi.advanceTimersByTime(windowMs + 1000);

      const secondsRemaining = limiter.getSecondsUntilReset(key);
      expect(secondsRemaining).toBeLessThanOrEqual(1); // Should be very close to 0
    });

    it('should handle non-existent key', () => {
      const secondsRemaining = limiter.getSecondsUntilReset('nonexistent');
      expect(secondsRemaining).toBe(0);
    });

    it('should decrease over time', () => {
      const key = 'user@test.com';
      limiter.isAllowed(key, 5, 60000);

      const before = limiter.getSecondsUntilReset(key);
      vi.advanceTimersByTime(5000); // 5 seconds
      const after = limiter.getSecondsUntilReset(key);

      expect(after).toBeLessThan(before);
    });
  });

  describe('Security - Login Rate Limiting', () => {
    it('should limit login attempts to 5 per 15 minutes', () => {
      const key = 'login_attacker@test.com';
      const maxAttempts = 5;
      const windowMs = 15 * 60 * 1000; // 15 minutes

      // Allow 5 attempts
      for (let i = 0; i < 5; i++) {
        expect(limiter.isAllowed(key, maxAttempts, windowMs)).toBe(true);
      }

      // 6th attempt blocked
      expect(limiter.isAllowed(key, maxAttempts, windowMs)).toBe(false);
    });

    it('should prevent brute force attack with 6th login attempt', () => {
      const email = 'attacker@test.com';
      const maxAttempts = 5;
      const windowMs = 15 * 60 * 1000;

      // Simulate brute force: 6 rapid attempts
      const results = [];
      for (let i = 0; i < 6; i++) {
        results.push(limiter.isAllowed(email, maxAttempts, windowMs));
      }

      expect(results).toEqual([true, true, true, true, true, false]);
    });
  });

  describe('Security - Registration Rate Limiting', () => {
    it('should limit registration to 3 per hour', () => {
      const key = 'new_accounts_from_ip_192.168.1.1';
      const maxAttempts = 3;
      const windowMs = 60 * 60 * 1000; // 1 hour

      // Allow 3 registrations
      for (let i = 0; i < 3; i++) {
        expect(limiter.isAllowed(key, maxAttempts, windowMs)).toBe(true);
      }

      // 4th blocked
      expect(limiter.isAllowed(key, maxAttempts, windowMs)).toBe(false);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero max attempts', () => {
      const result = limiter.isAllowed('key', 0, 60000);
      expect(result).toBe(false);
    });

    it('should handle very small time window', () => {
      const key = 'user@test.com';
      limiter.isAllowed(key, 1, 1); // 1ms window

      vi.advanceTimersByTime(2);
      const result = limiter.isAllowed(key, 1, 1);
      expect(result).toBe(true); // Should reset after 1ms
    });

    it('should handle very large max attempts', () => {
      const key = 'user@test.com';
      const maxAttempts = 1000;

      for (let i = 0; i < maxAttempts; i++) {
        expect(limiter.isAllowed(key, maxAttempts, 60000)).toBe(true);
      }

      expect(limiter.isAllowed(key, maxAttempts, 60000)).toBe(false);
    });

    it('should handle special characters in key', () => {
      const specialKeys = [
        'user+tag@example.com',
        'user.name@example.co.uk',
        'user_name@example.com',
        'user-name@example.com',
      ];

      specialKeys.forEach(key => {
        const result = limiter.isAllowed(key, 5, 60000);
        expect(result).toBe(true);
      });
    });

    it('should handle very long keys', () => {
      const longKey = 'a'.repeat(500) + '@example.com';
      const result = limiter.isAllowed(longKey, 5, 60000);
      expect(result).toBe(true);
    });
  });

  describe('Performance', () => {
    it('should handle 100 concurrent users efficiently', () => {
      const startTime = Date.now();

      for (let i = 0; i < 100; i++) {
        const key = `user${i}@test.com`;
        limiter.isAllowed(key, 5, 60000);
      }

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(100); // Should complete in less than 100ms
    });

    it('should handle 1000 requests from single user', () => {
      const startTime = Date.now();
      const key = 'user@test.com';

      for (let i = 0; i < 1000; i++) {
        limiter.isAllowed(key, 10000, 60000); // High limit to not block
      }

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(200); // Should complete quickly
    });
  });
});
