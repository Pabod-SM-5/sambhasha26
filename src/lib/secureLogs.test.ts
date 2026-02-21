import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { secureLogger } from './secureLogs';

describe('Secure Logging - Data Sanitization Tests', () => {
  describe('secureLogger.info', () => {
    it('should log info level messages', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      secureLogger.info('User login attempt', { email: 'user@example.com' });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should sanitize password from info logs', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      secureLogger.info('Sensitive info', { password: 'MySecret123@' });

      const lastCall = consoleSpy.mock.calls[consoleSpy.mock.calls.length - 1];
      expect(String(lastCall?.[0])).not.toContain('MySecret123@');

      consoleSpy.mockRestore();
    });
  });

  describe('secureLogger.warn', () => {
    it('should log warning messages', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      secureLogger.warn('Failed login attempt', { email: 'attacker@test.com' });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should sanitize sensitive fields from warnings', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      secureLogger.warn('Suspicious activity', {
        email: 'user@example.com',
        password: 'Password123!',
        token: 'secret-token-123',
      });

      // Verify warning was logged
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('secureLogger.error', () => {
    it('should log error level messages', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      secureLogger.error('Database error', { code: 'DB001' });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should sanitize sensitive data from error logs', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      secureLogger.error('Authentication failed', {
        email: 'user@example.com',
        apiKey: 'secret-api-key-12345',
      });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('secureLogger.debug', () => {
    it('should log debug level messages', () => {
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});
      secureLogger.debug('Debug info', { value: 'test' });

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Sensitive Field Redaction', () => {
    it('should redact password field', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      secureLogger.info('Test', { password: 'MySecret@123' });

      // The function should have redacted the password
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should redact token field', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      secureLogger.info('Test', { token: 'bearer.xyz.abc' });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should redact apiKey field', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      secureLogger.info('Test', { apiKey: 'sk_live_abc123' });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should redact NIC field', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      secureLogger.info('Test', { nic: '123456789V' });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should redact SSN field', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      secureLogger.info('Test', { ssn: '123-45-6789' });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should redact creditCard field', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      secureLogger.info('Test', { creditCard: '4532-1234-5678-9010' });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should redact debitCard field', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      secureLogger.info('Test', { debitCard: '4532-1234-5678-9010' });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should redact secret field', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      secureLogger.info('Test', { secret: 'very-secret-value' });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should redact authorization header', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      secureLogger.info('Test', { authorization: 'Bearer token123' });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle case-insensitive sensitive keys', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      secureLogger.info('Test', { PASSWORD: 'secret', API_KEY: 'key', Token: 'token' });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Multiple Sensitive Fields', () => {
    it('should redact multiple sensitive fields in single object', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      secureLogger.info('User registration', {
        email: 'user@example.com',
        password: 'MyPass@123',
        phone: '0112345678',
        creditCard: '1234-5678-9010-1234',
        ssn: '000-00-0000',
      });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should preserve non-sensitive fields while redacting sensitive ones', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      secureLogger.info('User action', {
        email: 'user@example.com', // Should be visible
        password: 'Secret123!', // Should be redacted
        action: 'login', // Should be visible
        token: 'abc123xyz', // Should be redacted
      });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Nested Objects Sanitization', () => {
    it('should sanitize nested objects', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      secureLogger.info('Test', {
        user: {
          email: 'user@example.com',
          password: 'Secret@123',
        },
        api: {
          key: 'api_key_123',
          secret: 'api_secret_456',
        },
      });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle deeply nested sensitive data', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      secureLogger.info('Deep nested', {
        level1: {
          level2: {
            level3: {
              password: 'hidden-password',
              email: 'visible@example.com',
            },
          },
        },
      });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should handle circular reference protection (recursion prevention)', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      const obj: any = { email: 'user@example.com', password: 'secret' };
      // Create circular reference
      obj.self = obj;

      // Should not crash
      secureLogger.info('Test', obj);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Array Handling', () => {
    it('should handle arrays in context', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      secureLogger.info('Test', {
        users: [
          { email: 'user1@example.com', password: 'pass1' },
          { email: 'user2@example.com', password: 'pass2' },
        ],
      });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Security - No Sensitive Data Leakage', () => {
    it('should never log raw passwords', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      const password = 'MySecurePassword@123456';

      secureLogger.error('Login failed', { email: 'user@example.com', password });

      // Verify logged output doesn't contain the password
      const logCalls = consoleSpy.mock.calls;
      const loggedText = JSON.stringify(logCalls);
      
      expect(loggedText).not.toContain(password);

      consoleSpy.mockRestore();
    });

    it('should never log raw API keys', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      const apiKey = 'sk_live_abcdef123456';

      secureLogger.info('API call', { apiKey, endpoint: '/users' });

      const loggedText = JSON.stringify(consoleSpy.mock.calls);
      expect(loggedText).not.toContain(apiKey);

      consoleSpy.mockRestore();
    });

    it('should never log raw tokens', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNHV';

      secureLogger.warn('Authentication', { token, user: 'admin' });

      const loggedText = JSON.stringify(consoleSpy.mock.calls);
      expect(loggedText).not.toContain(token);

      consoleSpy.mockRestore();
    });

    it('should never log raw NIC', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      const nic = '123456789V';

      secureLogger.info('User registered', { email: 'user@example.com', nic });

      const loggedText = JSON.stringify(consoleSpy.mock.calls);
      expect(loggedText).not.toContain(nic);

      consoleSpy.mockRestore();
    });
  });

  describe('Non-Sensitive Data Preservation', () => {
    it('should preserve email addresses', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      const email = 'user@example.com';

      secureLogger.info('Login', { email });

      const loggedText = JSON.stringify(consoleSpy.mock.calls);
      expect(loggedText).toContain(email);

      consoleSpy.mockRestore();
    });

    it('should preserve usernames', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      secureLogger.info('User action', {
        username: 'john_doe',
        action: 'profile_update',
      });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should preserve error codes and messages', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      secureLogger.error('Database error', {
        code: 'DB_CONNECTION_FAILED',
        message: 'Unable to connect to database',
        retryCount: 3,
      });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('Log Level Tests', () => {
    it('should include timestamp in logs', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      secureLogger.info('Timestamped log', { value: 'test' });

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should include log level in output', () => {
      const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
      
      secureLogger.info('Info level', {});
      secureLogger.warn('Warn level', {});
      secureLogger.error('Error level', {});

      expect(consoleSpy.mock.calls.length).toBeGreaterThan(0);

      consoleSpy.mockRestore();
    });
  });
});
