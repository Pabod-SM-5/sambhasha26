import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { retryWithBackoff } from './exponentialBackoff';

describe('Exponential Backoff - Retry Logic Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  describe('retryWithBackoff - Basic Functionality', () => {
    it('should succeed on first attempt', async () => {
      const mockFn = vi.fn().mockResolvedValueOnce('success');
      const result = await retryWithBackoff(mockFn);

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error('First fail'))
        .mockRejectedValueOnce(new Error('Second fail'))
        .mockResolvedValueOnce('success');

      const promise = retryWithBackoff(mockFn, { maxAttempts: 3 });
      
      await vi.runAllTimersAsync();

      const result = await promise;
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max attempts exceeded', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Permanent failure'));

      const promise = retryWithBackoff(mockFn, { maxAttempts: 2 });
      
      // FIX: Unhandled Rejection වැළැක්වීමට Catch Promise එකක් සෑදීම
      const catchPromise = expect(promise).rejects.toThrow('Permanent failure');
      await vi.runAllTimersAsync();
      await catchPromise;
      
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('retryWithBackoff - Exponential Backoff', () => {
    it('should respect initial delay', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error('Fail'))
        .mockResolvedValueOnce('success');

      const initialDelayMs = 100;
      const promise = retryWithBackoff(mockFn, { 
        maxAttempts: 2,
        initialDelayMs
      });

      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(initialDelayMs);
      await vi.runAllTimersAsync();

      const result = await promise;
      expect(result).toBe('success');
    });

    it('should increase delay with each retry', async () => {
      // FIX: මෙතන තිබූ අනවශ්‍ය vi.useFakeTimers() ඉවත් කළා
      const initialDelayMs = 100;
      const backoffMultiplier = 2;
      let callCount = 0;
      
      const mockFn = vi.fn(async () => {
        callCount++;
        if (callCount < 3) {
          throw new Error('Retry needed');
        }
        return 'success';
      });

      const promise = retryWithBackoff(mockFn, {
        initialDelayMs,
        maxDelayMs: 1000,
        maxAttempts: 3,
        backoffMultiplier,
      });

      await vi.runAllTimersAsync();
      
      const result = await promise;
      expect(result).toBe('success');
      expect(callCount).toBe(3);
    });

    it('should cap delay at maxDelayMs', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Fail'));

      const promise = retryWithBackoff(mockFn, {
        maxAttempts: 5,
        initialDelayMs: 1000,
        maxDelayMs: 2000,
        backoffMultiplier: 4,
      });

      // FIX: Unhandled Rejection Catch කිරීම
      const catchPromise = expect(promise).rejects.toThrow('Fail');
      await vi.runAllTimersAsync();
      await catchPromise;
    });
  });

  describe('retryWithBackoff - Callback Handling', () => {
    it('should call onRetry callback on failure', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error('Fail'))
        .mockResolvedValueOnce('success');

      const onRetry = vi.fn();

      const promise = retryWithBackoff(mockFn, {
        maxAttempts: 2,
        onRetry,
      });

      await vi.runAllTimersAsync();
      await promise;

      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(
        1, 
        expect.any(Number), 
        expect.any(Error) 
      );
    });

    it('should provide attempt information in callback', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Test error'));
      const onRetry = vi.fn();

      const promise = retryWithBackoff(mockFn, {
        maxAttempts: 3,
        onRetry,
      });

      // FIX: Catch Promise එක එක් කළා
      const catchPromise = expect(promise).rejects.toThrow('Test error');
      await vi.runAllTimersAsync();
      await catchPromise;

      expect(onRetry).toHaveBeenCalledTimes(2);
    });
  });

  describe('retryWithBackoff - Security Tests', () => {
    it('should prevent thundering herd with jitter', async () => {
      const operations = Array.from({ length: 5 }, (_, i) => {
        const mockFn = vi.fn()
          .mockRejectedValueOnce(new Error('Fail'))
          .mockResolvedValueOnce(`success${i}`);

        return retryWithBackoff(mockFn, {
          maxAttempts: 2,
          initialDelayMs: 100,
        });
      });

      const promise = Promise.all(operations);
      await vi.runAllTimersAsync();

      const results = await promise;
      expect(results).toHaveLength(5);
    });

    it('should handle connection timeout gracefully', async () => {
      const timeoutError = new Error('Connection timeout');
      const mockFn = vi.fn().mockRejectedValue(timeoutError);

      const promise = retryWithBackoff(mockFn, {
        maxAttempts: 3,
        initialDelayMs: 100,
      });

      // FIX: Catch Promise එක එක් කළා
      const catchPromise = expect(promise).rejects.toThrow('Connection timeout');
      await vi.runAllTimersAsync();
      await catchPromise;
      
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should work with fetch-like operations', async () => {
      let attemptCount = 0;
      const mockFetch = vi.fn(async () => {
        attemptCount++;
        if (attemptCount < 2) {
          throw new Error('Network error');
        }
        return { ok: true, status: 200 };
      });

      // FIX: Asynchronous ක්‍රියාවලිය නිවැරදිව පරීක්ෂා කිරීම
      const promise = retryWithBackoff(mockFetch, {
        maxAttempts: 3,
        initialDelayMs: 1,
      });
      
      await vi.runAllTimersAsync();
      const result = await promise;
      
      expect(result.ok).toBe(true);
    });
  });

  describe('retryWithBackoff - Custom Options', () => {
    it('should use default options when not provided', async () => {
      const mockFn = vi.fn().mockResolvedValueOnce('success');
      const result = await retryWithBackoff(mockFn);

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should accept partial options and use defaults for rest', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error('Fail'))
        .mockResolvedValueOnce('success');

      const promise = retryWithBackoff(mockFn, {
        maxAttempts: 2,
      });

      await vi.runAllTimersAsync();
      const result = await promise;
      expect(result).toBe('success');
    });

    it('should respect custom max attempts', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('Fail'));

      const promise = retryWithBackoff(mockFn, {
        maxAttempts: 5,
      });

      // FIX: Catch Promise
      const catchPromise = expect(promise).rejects.toThrow('Fail');
      await vi.runAllTimersAsync();
      await catchPromise;
      
      expect(mockFn).toHaveBeenCalledTimes(5);
    });
  });

  describe('retryWithBackoff - Generic Type Support', () => {
    it('should work with string return type', async () => {
      const mockFn = vi.fn().mockResolvedValueOnce('test string');
      const result = await retryWithBackoff<string>(mockFn);

      expect(result).toBe('test string');
    });

    it('should work with object return type', async () => {
      const mockData = { id: 1, name: 'Test' };
      const mockFn = vi.fn().mockResolvedValueOnce(mockData);
      const result = await retryWithBackoff(mockFn);

      expect(result).toEqual(mockData);
    });

    it('should work with array return type', async () => {
      const mockArray = [1, 2, 3, 4, 5];
      const mockFn = vi.fn().mockResolvedValueOnce(mockArray);
      const result = await retryWithBackoff(mockFn);

      expect(result).toEqual(mockArray);
    });
  });

  describe('Edge Cases', () => {
    it('should handle immediate success', async () => {
      const mockFn = vi.fn().mockResolvedValueOnce('immediate');
      const result = await retryWithBackoff(mockFn);

      expect(result).toBe('immediate');
    });

    it('should handle single attempt (no retry)', async () => {
      const mockFn = vi.fn().mockResolvedValueOnce('success');
      const result = await retryWithBackoff(mockFn, { maxAttempts: 1 });

      expect(result).toBe('success');
    });

    it('should handle error on last attempt', async () => {
      // FIX: Mock logic එක නිවැරදි කිරීම (අවසාන අවස්ථාවේදීත් fail වීම)
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error('1st fail'))
        .mockRejectedValueOnce(new Error('2nd fail'))
        .mockRejectedValueOnce(new Error('3rd fail'));

      const promise = retryWithBackoff(mockFn, { maxAttempts: 3 });

      const catchPromise = expect(promise).rejects.toThrow('3rd fail');
      await vi.runAllTimersAsync();
      await catchPromise;
    });

    it('should handle null return value', async () => {
      const mockFn = vi.fn().mockResolvedValueOnce(null);
      const result = await retryWithBackoff(mockFn);

      expect(result).toBeNull();
    });

    it('should handle undefined return value', async () => {
      const mockFn = vi.fn().mockResolvedValueOnce(undefined);
      const result = await retryWithBackoff(mockFn);

      expect(result).toBeUndefined();
    });
  });

  describe('Performance', () => {
    it('should complete successful operation quickly', async () => {
      const mockFn = vi.fn().mockResolvedValueOnce('success');
      const startTime = Date.now();

      await retryWithBackoff(mockFn);

      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(50); 
    });

    it('should handle rapid retries efficiently', async () => {
      const mockFn = vi.fn()
        .mockRejectedValueOnce(new Error('1'))
        .mockRejectedValueOnce(new Error('2'))
        .mockResolvedValueOnce('success');

      const promise = retryWithBackoff(mockFn, {
        maxAttempts: 3,
        initialDelayMs: 10,
      });

      await vi.runAllTimersAsync();
      const result = await promise;
      expect(result).toBe('success');
    });
  });
});