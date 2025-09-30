import { config } from '../config';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

const logLevelMap: Record<string, LogLevel> = {
  error: LogLevel.ERROR,
  warn: LogLevel.WARN,
  info: LogLevel.INFO,
  debug: LogLevel.DEBUG,
};

class Logger {
  private level: LogLevel;

  constructor() {
    this.level = logLevelMap[config.LOG_LEVEL] || LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private formatMessage(level: string, message: string, meta?: any): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
  }

  error(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage('error', message, meta));
    }
  }

  warn(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage('warn', message, meta));
    }
  }

  info(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage('info', message, meta));
    }
  }

  debug(message: string, meta?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage('debug', message, meta));
    }
  }

  apiRequest(method: string, url: string, params?: any): void {
    this.debug(`GitHub API Request: ${method} ${url}`, { params });
  }

  apiResponse(method: string, url: string, status: number, duration?: number): void {
    const level = status >= 400 ? 'error' : 'debug';
    const message = `GitHub API Response: ${method} ${url} - ${status}`;
    const meta = duration ? { duration: `${duration}ms` } : undefined;
    
    if (level === 'error') {
      this.error(message, meta);
    } else {
      this.debug(message, meta);
    }
  }

  handlerStart(handlerName: string, args: any): void {
    this.debug(`Handler started: ${handlerName}`, { args });
  }

  handlerSuccess(handlerName: string, duration: number): void {
    this.info(`Handler completed: ${handlerName}`, { duration: `${duration}ms` });
  }

  handlerError(handlerName: string, error: Error, duration?: number): void {
    this.error(`Handler failed: ${handlerName}`, { 
      error: error.message, 
      stack: error.stack,
      duration: duration ? `${duration}ms` : undefined
    });
  }
}

export const logger = new Logger();
