/**
 * API Request Timeout Wrapper
 * Adds timeout protection to API calls
 */

export interface TimeoutOptions {
  timeoutMs?: number;
  onTimeout?: () => void;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds

/**
 * Wrap a promise with a timeout
 * Throws if promise doesn't resolve within timeout
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  options: TimeoutOptions = {}
): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT, onTimeout } = options;

  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      const timeoutId = setTimeout(() => {
        onTimeout?.();
        reject(new Error(`Request timeout after ${timeoutMs}ms`));
      }, timeoutMs);

      // Clean up timeout if promise settles first
      promise
        .then(() => clearTimeout(timeoutId))
        .catch(() => clearTimeout(timeoutId));
    })
  ]);
}

/**
 * Wrap fetch with timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit & TimeoutOptions = {}
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT, onTimeout, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    onTimeout?.();
  }, timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export default withTimeout;
