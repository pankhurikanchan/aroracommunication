import { config } from '../../config';

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'authorization',
  'cookie',
  'secret',
  'keysecret',
  'card',
  'cvv',
  'razorpay_signature',
]);

function sanitizeData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey)) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

class Logger {
  private formatLog(level: LogLevel, message: string, meta?: any, requestId?: string): string {
    const timestamp = new Date().toISOString();
    const sanitizedMeta = meta ? sanitizeData(meta) : undefined;

    if (config.nodeEnv === 'production') {
      return JSON.stringify({
        timestamp,
        level,
        message,
        requestId,
        ...(sanitizedMeta ? { meta: sanitizedMeta } : {}),
      });
    }

    const prefix = `[${timestamp}] [${level}]${requestId ? ` [Req: ${requestId}]` : ''}:`;
    if (sanitizedMeta) {
      return `${prefix} ${message} ${JSON.stringify(sanitizedMeta)}`;
    }
    return `${prefix} ${message}`;
  }

  debug(message: string, meta?: any, requestId?: string): void {
    if (config.nodeEnv === 'development') {
      console.debug(this.formatLog('DEBUG', message, meta, requestId));
    }
  }

  info(message: string, meta?: any, requestId?: string): void {
    console.log(this.formatLog('INFO', message, meta, requestId));
  }

  warn(message: string, meta?: any, requestId?: string): void {
    console.warn(this.formatLog('WARN', message, meta, requestId));
  }

  error(message: string, meta?: any, requestId?: string): void {
    console.error(this.formatLog('ERROR', message, meta, requestId));
  }
}

export const logger = new Logger();
