import { APIRequestContext } from '@playwright/test';
import { logger } from '../config/Logger';
import { configLoader } from '../config/ConfigLoader';
import { HttpResponse, RequestOptions } from '../models/Http';

// Core HTTP client — wraps Playwright's APIRequestContext with retry logic,
// logging, and safe JSON serialization
class APIClient {
  private requestContext: APIRequestContext;
  private baseUrl: string;
  private apiTimeout: number;
  private retryCount: number;

  constructor(requestContext: APIRequestContext) {
    this.requestContext = requestContext;
    this.baseUrl = configLoader.getBaseUrl();
    this.apiTimeout = configLoader.getApiTimeout();
    this.retryCount = configLoader.getRetryCount();
  }

  async get(endpoint: string, options?: RequestOptions): Promise<HttpResponse> {
    return this.performRequest('GET', endpoint, options);
  }

  async post(endpoint: string, options?: RequestOptions): Promise<HttpResponse> {
    return this.performRequest('POST', endpoint, options);
  }

  async put(endpoint: string, options?: RequestOptions): Promise<HttpResponse> {
    return this.performRequest('PUT', endpoint, options);
  }

  async delete(endpoint: string, options?: RequestOptions): Promise<HttpResponse> {
    return this.performRequest('DELETE', endpoint, options);
  }

  async patch(endpoint: string, options?: RequestOptions): Promise<HttpResponse> {
    return this.performRequest('PATCH', endpoint, options);
  }

  private async performRequest(
    method: string,
    endpoint: string,
    options?: RequestOptions,
  ): Promise<HttpResponse> {
    const url = this.buildUrl(endpoint);
    const timeout = options?.timeout || this.apiTimeout;
    const retries = options?.retries ?? this.retryCount;

    let lastError: Error | undefined;

    // Retry loop — backs off on transient failures AND on 405 (rate-limited by free public API)
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const startTime = performance.now();

        const requestOptions: Record<string, unknown> = {
          headers: this.buildHeaders(options?.headers),
          timeout,
        };

        // Only attach a body for mutating methods
        if (options?.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
          if (typeof options.body === 'string') {
            // Send raw string body as-is (e.g. intentionally malformed JSON in negative tests)
            requestOptions.data = options.body;
          } else {
            // Safely serialize object body — breaks circular references before Playwright sees them
            requestOptions.data = this.safeBody(options.body as Record<string, unknown>);
          }
        }

        logger.debug(`Sending ${method} request`, {
          url,
          attempt: attempt + 1,
        } as Record<string, unknown>);

        const response = await this.requestContext.fetch(url, {
          method,
          ...requestOptions,
        });

        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);

        // Parse body as JSON when the content-type indicates it; fall back to raw text
        let body: unknown;
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('application/json')) {
          body = await response.json().catch(() => ({}));
        } else {
          body = await response.text();
        }

        const result: HttpResponse = {
          status: response.status(),
          statusText: response.statusText(),
          headers: response.headers(),
          body,
          responseTime,
        };

        logger.debug(`Received response`, {
          method,
          endpoint,
          status: result.status,
          responseTime: result.responseTime,
        } as Record<string, unknown>);

        // Retry only on genuinely transient statuses (429 Too Many Requests, 5xx server errors).
        // 405 Method Not Allowed is not transient — restful-api.dev returns it consistently
        // when write access to /objects is unavailable, so retrying it just wastes time.
        const isTransient = result.status === 429 || result.status >= 500;
        if (isTransient && attempt < retries) {
          const waitMs = 1000 * (attempt + 1);
          logger.warn(`Status ${result.status} received, waiting ${waitMs}ms before retry`, {
            attempt: attempt + 1,
          } as Record<string, unknown>);
          await this.delay(waitMs);
          continue;
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        logger.warn(`Request failed (attempt ${attempt + 1}/${retries + 1})`, {
          error: lastError.message,
        } as Record<string, unknown>);

        if (attempt < retries) {
          // Exponential back-off: 1 s, 2 s, …
          await this.delay(1000 * (attempt + 1));
        }
      }
    }

    logger.error(`Request failed after ${retries + 1} attempts`, {
      error: lastError?.message,
    } as Record<string, unknown>);
    throw lastError || new Error('Request failed');
  }

  // Prepend base URL for relative paths; return absolute URLs unchanged
  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    return `${this.baseUrl}${endpoint}`;
  }

  private buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (customHeaders) {
      Object.assign(headers, customHeaders);
    }
    return headers;
  }

  // Replace circular references with a safe string so Playwright can serialize the body
  private safeBody(obj: Record<string, unknown>): Record<string, unknown> {
    try {
      // If serializable, return as-is
      JSON.stringify(obj);
      return obj;
    } catch {
      // Strip circular refs and return a plain object
      const seen = new Set<unknown>();
      const safe = JSON.stringify(obj, (_, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) return '[Circular]';
          seen.add(value);
        }
        return value as unknown;
      });
      return JSON.parse(safe) as Record<string, unknown>;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export { APIClient };

