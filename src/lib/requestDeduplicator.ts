/**
 * Request Deduplication Utility
 * Prevents duplicate concurrent requests for the same resource
 */

type RequestKey = string;
interface PendingRequest<T> {
  promise: Promise<T>;
  startTime: number;
}

class RequestDeduplicator {
  private pendingRequests: Map<RequestKey, PendingRequest<any>> = new Map();
  private readonly MAX_REQUEST_TIME = 30000; // 30 seconds timeout

  /**
   * Execute a request, but return existing promise if already in progress
   */
  async execute<T>(
    key: RequestKey,
    fn: () => Promise<T>,
    maxConcurrentTime: number = this.MAX_REQUEST_TIME
  ): Promise<T> {
    // Check if request already in progress
    const existing = this.pendingRequests.get(key);
    if (existing) {
      const elapsed = Date.now() - existing.startTime;
      // If request is still within acceptable time window, return it
      if (elapsed < maxConcurrentTime) {
        return existing.promise;
      }
      // If request has taken too long, remove it and start fresh
      this.pendingRequests.delete(key);
    }

    // Create new request
    const promise = fn().finally(() => {
      // Clean up after request completes
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, {
      promise,
      startTime: Date.now(),
    });

    return promise;
  }

  /**
   * Clear pending request (useful for mutations that invalidate cache)
   */
  invalidate(key: RequestKey): void {
    this.pendingRequests.delete(key);
  }

  /**
   * Clear all pending requests
   */
  clearAll(): void {
    this.pendingRequests.clear();
  }

  /**
   * Get number of pending requests
   */
  getPendingCount(): number {
    return this.pendingRequests.size;
  }
}

export const requestDeduplicator = new RequestDeduplicator();

/**
 * Hook to deduplicate profile fetches
 */
export const createProfileFetchKey = (userId: string): string => {
  return `profile_${userId}`;
};

/**
 * Hook to deduplicate category list fetches
 */
export const createCategoryListFetchKey = (): string => {
  return 'categories_list';
};

/**
 * Hook to deduplicate competitor list fetches
 */
export const createCompetitorListFetchKey = (schoolId: string): string => {
  return `competitors_${schoolId}`;
};

export default RequestDeduplicator;
