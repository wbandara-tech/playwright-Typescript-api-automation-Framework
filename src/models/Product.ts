// Domain model for the /objects resource on restful-api.dev
export interface Product {
  id?: string;             // Assigned by the server on creation
  name: string;
  data?: Record<string, unknown>; // Flexible key-value metadata (year, price, etc.)
}

// Full response shape returned by POST / GET-by-ID
export interface ProductResponse {
  id: string;
  name: string;
  data: Record<string, unknown>;
}

// Generic wrapper used in helper utilities
export interface ApiResponse<T> {
  statusCode: number;
  headers: Record<string, string>;
  body: T;
  responseTime: number;
}

// Shape of error payloads returned by the API
export interface ErrorResponse {
  error?: string;
  message?: string;
  statusCode?: number;
}

