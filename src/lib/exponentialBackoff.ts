/**
 * Exponential Backoff Retry Logic
 * Safely retries failed operations with increasing delays
 * Includes jitter to prevent thundering herd problem
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  maxTotalTimeMs?: number; // Total timeout across all retries
  backoffMultiplier?: number;
  onRetry?: (attempt: number, delay: number, error: Error) => void;
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  initialDelayMs: 500,
  maxDelayMs: 30000,
  maxTotalTimeMs: 60000, // 60 second total timeout
  backoffMultiplier: 2,
  onRetry: () => {},
};

/**
 * Calculate delay with exponential backoff and jitter
 * Formula: min(maxDelay, initialDelay * multiplier^attempt) + random jitter
 */
function calculateDelay(
  attempt: number,
  options: Required<RetryOptions>
): number {
  const exponentialDelay = options.initialDelayMs * 
    Math.pow(options.backoffMultiplier, attempt);
  
  const cappedDelay = Math.min(exponentialDelay, options.maxDelayMs);
  
  // Add jitter (±20% of delay) to prevent thundering herd
  const jitter = cappedDelay * 0.2 * (Math.random() * 2 - 1);
  
  return Math.max(0, cappedDelay + jitter);
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  userOptions?: RetryOptions
): Promise<T> {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };
  let lastError: Error | null = null;
  const startTime = Date.now();

  for (let attempt = 0; attempt < options.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if total time exceeded
      const totalElapsed = Date.now() - startTime;
      if (totalElapsed > options.maxTotalTimeMs) {
        throw lastError;
      }

      // Don't retry on last attempt
      if (attempt === options.maxAttempts - 1) {
        throw lastError;
      }

      const delay = calculateDelay(attempt, options);
      options.onRetry(attempt + 1, delay, lastError);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Max retries exceeded');
}

/**
 * Retry configuration for specific operations
 */
export const retryConfigs = {
  // Profile fetch - important operation, more retries
  profileFetch: {
    maxAttempts: 4,
    initialDelayMs: 300,
    maxDelayMs: 5000,
    backoffMultiplier: 2,
  },

  // Database queries - moderate
  databaseQuery: {
    maxAttempts: 3,
    initialDelayMs: 500,
    maxDelayMs: 10000,
    backoffMultiplier: 2,
  },

  // File uploads - more retries for network issues
  fileUpload: {
    maxAttempts: 5,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
  },

  // API calls - moderate
  apiCall: {
    maxAttempts: 3,
    initialDelayMs: 500,
    maxDelayMs: 15000,
    backoffMultiplier: 2,
  },
};
