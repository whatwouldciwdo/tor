// lib/rate-limit.ts
/**
 * In-memory rate limiter using token bucket algorithm
 * Suitable for development and small-scale production (single server)
 * For multi-server deployments, consider Redis-based rate limiting
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry>;
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.store = new Map();
    
    // Cleanup old entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if request is allowed under rate limit
   * @param key - Unique identifier (e.g., userId, IP address)
   * @param config - Rate limit configuration
   * @returns Object with allowed status and remaining tokens
   */
  check(key: string, config: RateLimitConfig): { allowed: boolean; remaining: number; resetAt: number } {
    const now = Date.now();
    let entry = this.store.get(key);

    if (!entry) {
      // First request from this key
      entry = {
        tokens: config.maxRequests - 1,
        lastRefill: now,
      };
      this.store.set(key, entry);
      
      return {
        allowed: true,
        remaining: entry.tokens,
        resetAt: now + config.windowMs,
      };
    }

    // Calculate tokens to add based on time passed
    const timePassed = now - entry.lastRefill;
    const tokensToAdd = Math.floor(timePassed / config.windowMs) * config.maxRequests;

    if (tokensToAdd > 0) {
      entry.tokens = Math.min(config.maxRequests, entry.tokens + tokensToAdd);
      entry.lastRefill = now;
    }

    // Check if request is allowed
    if (entry.tokens > 0) {
      entry.tokens--;
      this.store.set(key, entry);
      
      return {
        allowed: true,
        remaining: entry.tokens,
        resetAt: entry.lastRefill + config.windowMs,
      };
    }

    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.lastRefill + config.windowMs,
    };
  }

  /**
   * Remove entries older than 1 hour
   */
  private cleanup(): void {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    for (const [key, entry] of this.store.entries()) {
      if (entry.lastRefill < oneHourAgo) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Clear all rate limit entries (useful for testing)
   */
  reset(): void {
    this.store.clear();
  }

  /**
   * Cleanup interval on shutdown
   */
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Predefined rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  // General API endpoints: 100 requests per 15 minutes
  general: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000,
  },
  
  // Login endpoint: 5 attempts per 15 minutes (per IP)
  login: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  },
  
  // TOR creation: 10 creations per 15 minutes (per user)
  createTor: {
    maxRequests: 10,
    windowMs: 15 * 60 * 1000,
  },
  
  // TOR updates: 50 updates per 15 minutes (per user)
  updateTor: {
    maxRequests: 50,
    windowMs: 15 * 60 * 1000,
  },
};

// Note: Automatic cleanup on process exit is not available in Edge Runtime
// The cleanup interval in the RateLimiter class handles memory management
