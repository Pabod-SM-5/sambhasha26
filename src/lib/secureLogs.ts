/**
 * Secure Logging Utility
 * Prevents sensitive data from being logged
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'key',
  'authorization',
  'api_key',
  'apiKey',
  'nic',
  'ssn',
  'creditCard',
  'debitCard',
];

/**
 * Check if a key contains sensitive information
 */
const isSensitiveKey = (key: string): boolean => {
  return SENSITIVE_KEYS.some(sensitiveKey => 
    key.toLowerCase().includes(sensitiveKey.toLowerCase())
  );
};

/**
 * Sanitize sensitive data from objects
 */
const sanitizeObject = (obj: Record<string, any>, depth = 0): Record<string, any> => {
  if (depth > 5) return {}; // Prevent deep recursion
  
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (isSensitiveKey(key)) {
      sanitized[key] = '[REDACTED]';
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, any>, depth + 1);
    } else if (Array.isArray(value)) {
      sanitized[key] = '[Array]';
    } else if (typeof value === 'string' && value.length > 100) {
      sanitized[key] = `${value.substring(0, 50)}...`;
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
};

/**
 * Safe logging function
 */
const safeLog = (level: LogLevel, message: string, context?: Record<string, any>) => {
  const timestamp = new Date().toISOString();
  
  let sanitizedContext: Record<string, any> | undefined;
  if (context) {
    sanitizedContext = sanitizeObject(context);
  }

  const logEntry: LogEntry = {
    timestamp,
    level,
    message,
    context: sanitizedContext,
  };

  // Always log to console for testing and debugging
  switch (level) {
    case 'error':
      console.error(`[${timestamp}] ERROR:`, message, sanitizedContext);
      break;
    case 'warn':
      console.warn(`[${timestamp}] WARN:`, message, sanitizedContext);
      break;
    case 'info':
      console.info(`[${timestamp}] INFO:`, message, sanitizedContext);
      break;
    case 'debug':
      console.debug(`[${timestamp}] DEBUG:`, message, sanitizedContext);
      break;
    }

  // In production, you would send this to a logging service
  // Example: sendToLoggingService(logEntry)
};

export const secureLogger = {
  error: (message: string, context?: Record<string, any>) => safeLog('error', message, context),
  warn: (message: string, context?: Record<string, any>) => safeLog('warn', message, context),
  info: (message: string, context?: Record<string, any>) => safeLog('info', message, context),
  debug: (message: string, context?: Record<string, any>) => safeLog('debug', message, context),
};
