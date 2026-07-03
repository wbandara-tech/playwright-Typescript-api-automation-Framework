import dotenv from 'dotenv';
import path from 'path';

// Singleton configuration manager — loads .env.{NODE_ENV} on startup
class ConfigLoader {
  private static instance: ConfigLoader;
  private config: Record<string, string>;

  private constructor() {
    this.config = this.loadEnvironmentVariables();
  }

  // Return the single shared instance (create on first call)
  static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader();
    }
    return ConfigLoader.instance;
  }

  private loadEnvironmentVariables(): Record<string, string> {
    // Load env file matching NODE_ENV (e.g. .env.dev, .env.qa)
    const env = process.env.NODE_ENV || 'dev';
    const envFile = path.resolve(process.cwd(), `.env.${env}`);
    dotenv.config({ path: envFile });

    return {
      BASE_URL: this.getEnvVariable('BASE_URL', 'https://api.restful-api.dev'),
      API_TIMEOUT: this.getEnvVariable('API_TIMEOUT', '30000'),
      RETRY_COUNT: this.getEnvVariable('RETRY_COUNT', '2'),
      LOG_LEVEL: this.getEnvVariable('LOG_LEVEL', 'info'),
    };
  }

  // Return env var value or fall back to default; throw if neither exists
  private getEnvVariable(key: string, defaultValue?: string): string {
    const value = process.env[key];
    if (!value && !defaultValue) {
      throw new Error(`Environment variable ${key} is not set and no default value provided.`);
    }
    return value || defaultValue || '';
  }

  get<T = string>(key: keyof typeof this.config, defaultValue?: T): T {
    const value = this.config[key] || (defaultValue as T);
    if (value === undefined) {
      throw new Error(`Configuration key ${String(key)} not found`);
    }
    return value as T;
  }

  getBaseUrl(): string {
    return this.get('BASE_URL');
  }

  getApiTimeout(): number {
    return parseInt(this.get('API_TIMEOUT'), 10);
  }

  getRetryCount(): number {
    return parseInt(this.get('RETRY_COUNT'), 10);
  }

  getLogLevel(): string {
    return this.get('LOG_LEVEL');
  }
}

export const configLoader = ConfigLoader.getInstance();

