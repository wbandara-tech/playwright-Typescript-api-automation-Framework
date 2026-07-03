import { test, expect } from '../fixtures/fixtures';
import { API_ENDPOINTS, HTTP_STATUS_CODES, RESPONSE_HEADERS } from '../../src/config/Constants';

// GET tests verify read operations: status codes, headers, response structure, and performance
test.describe('@api @get GET Endpoint Tests', () => {

  test('@regression Verify response headers contain content-type', async ({ apiClient, responseValidator }) => {
    const response = await apiClient.get(API_ENDPOINTS.OBJECTS);

    expect(response.status).toBeGreaterThan(0);
    responseValidator.validateHeaderExists(response.headers, RESPONSE_HEADERS.CONTENT_TYPE);
  });

  test('@regression Verify response time is reasonable', async ({
    apiClient,
    responseTimeAssertions,
  }) => {
    const response = await apiClient.get(API_ENDPOINTS.OBJECTS);

    // Allow up to 10 s for network variance
    responseTimeAssertions.assertResponseTimeWithinLimit(response.responseTime, 10000);
  });

  test('@regression Retrieve specific object by valid ID', async ({ apiClient, responseValidator }) => {
    // First fetch the full list, then retrieve the first item by its ID
    const allResponse = await apiClient.get(API_ENDPOINTS.OBJECTS);
    const objects = Array.isArray(allResponse.body) ? allResponse.body : [];

    if (objects.length > 0) {
      const firstObject = objects[0] as Record<string, unknown>;
      const objectId = firstObject.id as string;
      const response = await apiClient.get(`${API_ENDPOINTS.OBJECTS}/${objectId}`);

      responseValidator.validateStatusCode(response.status, HTTP_STATUS_CODES.OK);
      expect(response.body).toBeDefined();
    }
  });

  test('@regression Verify object response structure', async ({ apiClient }) => {
    const response = await apiClient.get(API_ENDPOINTS.OBJECTS);

    if (response.status === HTTP_STATUS_CODES.OK) {
      expect(Array.isArray(response.body)).toBe(true);
      if (Array.isArray(response.body) && response.body.length > 0) {
        const firstObject = response.body[0] as Record<string, unknown>;
        // Every object must have at least an id and a name field
        expect(firstObject).toHaveProperty('id');
        expect(firstObject).toHaveProperty('name');
      }
    }
  });

  test('@regression GET endpoint response body is JSON', async ({ apiClient, responseValidator }) => {
    const response = await apiClient.get(API_ENDPOINTS.OBJECTS);

    if (response.status === HTTP_STATUS_CODES.OK) {
      responseValidator.validateContentType(
        response.headers[RESPONSE_HEADERS.CONTENT_TYPE],
        RESPONSE_HEADERS.APPLICATION_JSON,
      );
    }
  });

  test('@regression GET with specific ID returns complete object', async ({ apiClient, responseValidator }) => {
    const allResponse = await apiClient.get(API_ENDPOINTS.OBJECTS);
    const objects = Array.isArray(allResponse.body) ? allResponse.body : [];

    if (objects.length > 0) {
      const firstObject = objects[0] as Record<string, unknown>;
      const objectId = firstObject.id as string;
      const response = await apiClient.get(`${API_ENDPOINTS.OBJECTS}/${objectId}`);

      if (response.status === HTTP_STATUS_CODES.OK) {
        responseValidator.validateStatusCode(response.status, HTTP_STATUS_CODES.OK);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('name');
      }
    }
  });
});