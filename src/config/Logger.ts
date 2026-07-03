import { configLoader } from './ConfigLoader';

// Log level hierarchy — only messages at or above the configured level are printed
enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

// Singleton structured logger with configurable verbosity
class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor() {
    const level = configLoader.getLogLevel().toLowerCase();
    this.logLevel = (LogLevel[level.toUpperCase() as keyof typeof LogLevel] || LogLevel.INFO) as LogLevel;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  // Safely convert data to JSON, replacing circular references with a placeholder
  private safeStringify(data: Record<string, unknown>): string {
    const seen = new Set<unknown>();
    return JSON.stringify(
      data,
      (_, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) return '[Circular]';
          seen.add(value);
        }
        return value as unknown;
      },
      2,
    );
  }

  private formatMessage(level: string, message: string, data?: Record<string, unknown>): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    let log = `${prefix} ${message}`;
    if (data) {
      log += ` ${this.safeStringify(data)}`;
    }
    return log;
  }

  debug(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(this.formatMessage(LogLevel.DEBUG, message, data));
    }
  }

  info(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(this.formatMessage(LogLevel.INFO, message, data));
    }
  }

  warn(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage(LogLevel.WARN, message, data));
    }
  }

  error(message: string, data?: Record<string, unknown>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage(LogLevel.ERROR, message, data));
    }
  }
}

export const logger = Logger.getInstance();

