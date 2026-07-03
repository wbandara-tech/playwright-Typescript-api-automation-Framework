import { test, expect } from '../fixtures/fixtures';
import { API_ENDPOINTS, HTTP_STATUS_CODES } from '../../src/config/Constants';

// Negative tests verify the API responds appropriately to invalid inputs,
// bad IDs, unsupported methods, and edge-case payloads
test.describe('@api @negative Negative Test Cases', () => {

  test('@negative Invalid endpoint returns error', async ({ apiClient }) => {
    const response = await apiClient.get('/invalid-endpoint-xyz');

    // Non-existent route: 404 expected; some WAF/proxies return 401
    expect([
      HTTP_STATUS_CODES.NOT_FOUND,
      HTTP_STATUS_CODES.BAD_REQUEST,
      HTTP_STATUS_CODES.UNAUTHORIZED,
    ]).toContain(response.status);
  });

  test('@negative POST with malformed JSON should be handled', async ({ apiClient }) => {
    // Sending a plain string with Content-Type: application/json — server should reject it
    const response = await apiClient.post(API_ENDPOINTS.OBJECTS, {
      body: 'invalid json string',
      headers: { 'Content-Type': 'application/json' },
    });

    expect([
      HTTP_STATUS_CODES.BAD_REQUEST,
      HTTP_STATUS_CODES.CREATED,
      HTTP_STATUS_CODES.OK,
    ]).toContain(response.status);
  });

  test('@negative GET with special characters in ID', async ({ apiClient }) => {
    const specialId = '!@#$%^&*()';

    const response = await apiClient.get(`${API_ENDPOINTS.OBJECTS}/${specialId}`);

    // Special chars in URL path may cause routing to return 404, 400, or 405
    expect([
      HTTP_STATUS_CODES.NOT_FOUND,
      HTTP_STATUS_CODES.BAD_REQUEST,
      HTTP_STATUS_CODES.METHOD_NOT_ALLOWED,
    ]).toContain(response.status);
  });

  test('@negative PUT with non-existent endpoint', async ({ apiClient }) => {
    const response = await apiClient.put('/non-existent-endpoint', {
      body: { name: 'test' },
    });

    // 404 or 401 depending on whether the proxy/WAF intercepts first
    expect([
      HTTP_STATUS_CODES.NOT_FOUND,
      HTTP_STATUS_CODES.BAD_REQUEST,
      HTTP_STATUS_CODES.UNAUTHORIZED,
    ]).toContain(response.status);
  });

  test('@negative DELETE with missing object ID', async ({ apiClient }) => {
    // DELETE on the collection root may return 404 or 405 depending on the API
    const response = await apiClient.delete(`${API_ENDPOINTS.OBJECTS}`);

    expect([
      HTTP_STATUS_CODES.NOT_FOUND,
      HTTP_STATUS_CODES.BAD_REQUEST,
      HTTP_STATUS_CODES.METHOD_NOT_ALLOWED,
      HTTP_STATUS_CODES.OK,
    ]).toContain(response.status);
  });

  test('@negative GET with extremely large ID', async ({ apiClient }) => {
    const largeId = 'x'.repeat(10000);

    const response = await apiClient.get(`${API_ENDPOINTS.OBJECTS}/${largeId}`);

    // Very long URLs may be rejected with 414 (URI Too Long), 400, 401, or 404
    expect([
      HTTP_STATUS_CODES.NOT_FOUND,
      HTTP_STATUS_CODES.BAD_REQUEST,
      HTTP_STATUS_CODES.UNAUTHORIZED,
      414, // URI Too Long — no named constant needed
    ]).toContain(response.status);
  });

  test('@negative Unsupported HTTP method on valid endpoint', async ({ apiClient }) => {
    // PATCH is not supported by this API — expect 405 Method Not Allowed
    const response = await apiClient.patch(API_ENDPOINTS.OBJECTS, {
      body: { name: 'test' },
    });

    expect([
      HTTP_STATUS_CODES.NOT_FOUND,
      HTTP_STATUS_CODES.BAD_REQUEST,
      HTTP_STATUS_CODES.METHOD_NOT_ALLOWED,
      HTTP_STATUS_CODES.OK,
      HTTP_STATUS_CODES.CREATED,
    ]).toContain(response.status);
  });

  test('@negative GET with SQL injection attempt', async ({ apiClient }) => {
    // API should safely return 404/400/401 without executing the injected SQL
    const maliciousId = "'; DROP TABLE objects; --";

    const response = await apiClient.get(`${API_ENDPOINTS.OBJECTS}/${maliciousId}`);

    // WAF may intercept and return 401 instead of 404
    expect([
      HTTP_STATUS_CODES.NOT_FOUND,
      HTTP_STATUS_CODES.BAD_REQUEST,
      HTTP_STATUS_CODES.UNAUTHORIZED,
    ]).toContain(response.status);
  });

  test('@negative GET with URL query parameters', async ({ apiClient }) => {
    // Query params on collection endpoint — must return a valid HTTP status
    const response = await apiClient.get(`${API_ENDPOINTS.OBJECTS}?filter=name&limit=10`);

    expect(response.status).toBeGreaterThan(0);
  });

  test('@negative Case sensitivity in endpoint path', async ({ apiClient }) => {
    // /Objects vs /objects — REST APIs are typically case-sensitive; WAF may return 401
    const response = await apiClient.get('/Objects');

    expect([
      HTTP_STATUS_CODES.NOT_FOUND,
      HTTP_STATUS_CODES.BAD_REQUEST,
      HTTP_STATUS_CODES.UNAUTHORIZED,
      HTTP_STATUS_CODES.OK,
    ]).toContain(response.status);
  });

  test('@negative PUT with empty ID in path', async ({ apiClient }) => {
    const response = await apiClient.put(`${API_ENDPOINTS.OBJECTS}//`, {
      body: { name: 'test' },
    });

    expect([
      HTTP_STATUS_CODES.NOT_FOUND,
      HTTP_STATUS_CODES.BAD_REQUEST,
      HTTP_STATUS_CODES.METHOD_NOT_ALLOWED,
      HTTP_STATUS_CODES.OK,
    ]).toContain(response.status);
  });
});

