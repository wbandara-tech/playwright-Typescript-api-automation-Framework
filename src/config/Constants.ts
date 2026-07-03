// API endpoint paths used across all test suites
export const API_ENDPOINTS = {
  OBJECTS: '/objects',
  OBJECTS_BY_ID: '/objects/:id',
} as const;

// Standard HTTP verb names for reference
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
} as const;

// HTTP status codes used in assertions
export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Common response header keys and expected values
export const RESPONSE_HEADERS = {
  CONTENT_TYPE: 'content-type',
  APPLICATION_JSON: 'application/json',
} as const;

export const TEST_DATA_TIMEOUT = 30000;

export const DEFAULT_RETRY_ATTEMPTS = 2;

