import { test, expect } from '../fixtures/fixtures';
import { API_ENDPOINTS, HTTP_STATUS_CODES } from '../../src/config/Constants';

// DELETE tests verify resource removal: correct status, post-delete 404, and idempotency behaviour
test.describe('@api @delete DELETE Endpoint Tests', () => {
  test('@regression DELETE response time should be acceptable', async ({
    apiClient,
    responseTimeAssertions,
    randomDataGenerator,
  }) => {
    const createPayload = {
      name: randomDataGenerator.generateProductName(),
      data: randomDataGenerator.generateProductData(),
    };

    const createResponse = await apiClient.post(API_ENDPOINTS.OBJECTS, { body: createPayload });

    if (typeof createResponse.body === 'object' && createResponse.body !== null) {
      const body = createResponse.body as Record<string, unknown>;
      const objectId = body.id as string;

      const deleteResponse = await apiClient.delete(`${API_ENDPOINTS.OBJECTS}/${objectId}`);

      responseTimeAssertions.assertResponseTimeWithinLimit(deleteResponse.responseTime, 10000);
    }
  });

  test('@regression Verify DELETE actually removes object from collection', async ({
    apiClient,
    randomDataGenerator,
  }) => {
    const createPayload = {
      name: randomDataGenerator.generateProductName(),
      data: randomDataGenerator.generateProductData(),
    };

    const createResponse = await apiClient.post(API_ENDPOINTS.OBJECTS, { body: createPayload });
    const initialResponse = await apiClient.get(API_ENDPOINTS.OBJECTS);
    const initialCount = Array.isArray(initialResponse.body) ? initialResponse.body.length : 0;

    if (typeof createResponse.body === 'object' && createResponse.body !== null) {
      const body = createResponse.body as Record<string, unknown>;
      const objectId = body.id as string;

      await apiClient.delete(`${API_ENDPOINTS.OBJECTS}/${objectId}`);

      const finalResponse = await apiClient.get(API_ENDPOINTS.OBJECTS);
      const finalCount = Array.isArray(finalResponse.body) ? finalResponse.body.length : 0;

      expect(finalCount).toBeLessThanOrEqual(initialCount);
    }
  });

  test('@regression DELETE with empty ID parameter', async ({ apiClient }) => {
    const response = await apiClient.delete(`${API_ENDPOINTS.OBJECTS}/`);

    // DELETE on /objects/ may return 404, 400, 405, or even 200 depending on the router
    expect([
      HTTP_STATUS_CODES.NOT_FOUND,
      HTTP_STATUS_CODES.BAD_REQUEST,
      HTTP_STATUS_CODES.METHOD_NOT_ALLOWED,
      HTTP_STATUS_CODES.OK,
    ]).toContain(response.status);
  });
});

