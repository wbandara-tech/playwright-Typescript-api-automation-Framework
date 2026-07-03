// Options accepted by APIClient methods
export interface RequestOptions {
  headers?: Record<string, string>;            // Custom headers merged with defaults
  body?: Record<string, unknown> | string;     // JSON object or raw string payload
  timeout?: number;                            // Per-request override (ms)
  retries?: number;                            // Override the global retry count
}

// Normalised response returned by every APIClient call
export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: unknown;
  responseTime: number; // Measured in milliseconds
}

// Runtime context injected into the test suite via ConfigLoader
export interface TestContext {
  baseUrl: string;
  apiTimeout: number;
  retryCount: number;
}

