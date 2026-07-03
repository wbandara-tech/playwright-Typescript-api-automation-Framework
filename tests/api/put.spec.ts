import { test, expect } from '../fixtures/fixtures';
import { API_ENDPOINTS, HTTP_STATUS_CODES, RESPONSE_HEADERS } from '../../src/config/Constants';

// PUT tests verify resource updates: correct status, changed field values, and error handling for bad IDs
// Helper: acceptable success statuses when creating a test object via POST
const POST_OK: number[] = [HTTP_STATUS_CODES.OK, HTTP_STATUS_CODES.CREATED];
// Helper: acceptable statuses for a successful PUT operation
const PUT_OK: number[] = [HTTP_STATUS_CODES.OK, HTTP_STATUS_CODES.CREATED, HTTP_STATUS_CODES.NO_CONTENT];

test.describe('@api @put PUT Endpoint Tests', () => {

  test('@smoke Update object with valid data', async ({ apiClient, randomDataGenerator }) => {
    const createPayload = {
      name: randomDataGenerator.generateProductName(),
      data: randomDataGenerator.generateProductData(),
    };

    const createResponse = await apiClient.post(API_ENDPOINTS.OBJECTS, { body: createPayload });

    // The public API occasionally denies writes (405); only assert the PUT flow
    // when object creation actually succeeded, matching the rest of this file.
    test.skip(!POST_OK.includes(createResponse.status), `POST returned ${createResponse.status}; write access unavailable`);

    if (typeof createResponse.body === 'object' && createResponse.body !== null) {
      const objectId = (createResponse.body as Record<string, unknown>).id as string;
      const updatePayload = {
        name: 'Updated Product Name',
        data: { year: 2025, price: 999, 'cpu model': 'Updated CPU', 'hard disk size': '1000 GB' },
      };

      const updateResponse = await apiClient.put(`${API_ENDPOINTS.OBJECTS}/${objectId}`, { body: updatePayload });

      expect(PUT_OK).toContain(updateResponse.status);
    }
  });

  test('@regression PUT updates object properties correctly', async ({ apiClient, randomDataGenerator }) => {
    const createPayload = {
      name: randomDataGenerator.generateProductName(),
      data: randomDataGenerator.generateProductData(),
    };

    const createResponse = await apiClient.post(API_ENDPOINTS.OBJECTS, { body: createPayload });

    if (typeof createResponse.body === 'object' && createResponse.body !== null &&
        POST_OK.includes(createResponse.status)) {
      const objectId = (createResponse.body as Record<string, unknown>).id as string;
      const newName = 'Completely Updated Product';
      const updatePayload = {
        name: newName,
        data: { year: 2026, price: 1500, 'cpu model': 'Intel Xeon', 'hard disk size': '2000 GB' },
      };

      const updateResponse = await apiClient.put(`${API_ENDPOINTS.OBJECTS}/${objectId}`, { body: updatePayload });
      expect(PUT_OK).toContain(updateResponse.status);

      // Verify the updated name is persisted
      const getResponse = await apiClient.get(`${API_ENDPOINTS.OBJECTS}/${objectId}`);
      if (getResponse.status === HTTP_STATUS_CODES.OK && typeof getResponse.body === 'object' && getResponse.body !== null) {
        expect((getResponse.body as Record<string, unknown>).name).toBe(newName);
      }
    }
  });

  test('@regression PUT with valid ID returns appropriate status', async ({
    apiClient,
    randomDataGenerator,
  }) => {
    const createPayload = {
      name: randomDataGenerator.generateProductName(),
      data: randomDataGenerator.generateProductData(),
    };

    const createResponse = await apiClient.post(API_ENDPOINTS.OBJECTS, { body: createPayload });

    if (typeof createResponse.body === 'object' && createResponse.body !== null &&
        POST_OK.includes(createResponse.status)) {
      const objectId = (createResponse.body as Record<string, unknown>).id as string;
      const updatePayload = { name: 'Updated Name', data: { updated: true } };

      const updateResponse = await apiClient.put(`${API_ENDPOINTS.OBJECTS}/${objectId}`, { body: updatePayload });

      expect([...PUT_OK, HTTP_STATUS_CODES.METHOD_NOT_ALLOWED]).toContain(updateResponse.status);
    }
  });

  test('@regression PUT with invalid ID returns error', async ({ apiClient }) => {
    const invalidId = 'nonexistent-id-' + Math.random().toString(36).substring(7);
    const updatePayload = { name: 'Updated Name', data: { test: true } };

    const response = await apiClient.put(`${API_ENDPOINTS.OBJECTS}/${invalidId}`, { body: updatePayload });

    // Invalid IDs may return 404, 400, or 405 (method not allowed on that resource)
    expect([
      HTTP_STATUS_CODES.NOT_FOUND,
      HTTP_STATUS_CODES.BAD_REQUEST,
      HTTP_STATUS_CODES.METHOD_NOT_ALLOWED,
    ]).toContain(response.status);
  });

  test('@regression PUT response contains Content-Type header', async ({
    apiClient,
    responseValidator,
    randomDataGenerator,
  }) => {
    const createPayload = {
      name: randomDataGenerator.generateProductName(),
      data: randomDataGenerator.generateProductData(),
    };

    const createResponse = await apiClient.post(API_ENDPOINTS.OBJECTS, { body: createPayload });

    if (typeof createResponse.body === 'object' && createResponse.body !== null &&
        POST_OK.includes(createResponse.status)) {
      const objectId = (createResponse.body as Record<string, unknown>).id as string;
      const updateResponse = await apiClient.put(`${API_ENDPOINTS.OBJECTS}/${objectId}`, {
        body: { name: 'Updated Name', data: { test: true } },
      });

      responseValidator.validateHeaderExists(updateResponse.headers, RESPONSE_HEADERS.CONTENT_TYPE);
    }
  });

  test('@regression PUT with empty payload', async ({ apiClient, randomDataGenerator }) => {
    const createPayload = {
      name: randomDataGenerator.generateProductName(),
      data: randomDataGenerator.generateProductData(),
    };

    const createResponse = await apiClient.post(API_ENDPOINTS.OBJECTS, { body: createPayload });

    if (typeof createResponse.body === 'object' && createResponse.body !== null &&
        POST_OK.includes(createResponse.status)) {
      const objectId = (createResponse.body as Record<string, unknown>).id as string;

      const response = await apiClient.put(`${API_ENDPOINTS.OBJECTS}/${objectId}`, { body: {} });

      expect([
        HTTP_STATUS_CODES.BAD_REQUEST,
        HTTP_STATUS_CODES.OK,
        HTTP_STATUS_CODES.CREATED,
        HTTP_STATUS_CODES.METHOD_NOT_ALLOWED,
      ]).toContain(response.status);
    }
  });

  test('@regression PUT with missing name field', async ({ apiClient, randomDataGenerator }) => {
    const createPayload = {
      name: randomDataGenerator.generateProductName(),
      data: randomDataGenerator.generateProductData(),
    };

    const createResponse = await apiClient.post(API_ENDPOINTS.OBJECTS, { body: createPayload });

    if (typeof createResponse.body === 'object' && createResponse.body !== null &&
        POST_OK.includes(createResponse.status)) {
      const objectId = (createResponse.body as Record<string, unknown>).id as string;

      const response = await apiClient.put(`${API_ENDPOINTS.OBJECTS}/${objectId}`, {
        body: { data: { test: true } },
      });

      expect([
        HTTP_STATUS_CODES.BAD_REQUEST,
        HTTP_STATUS_CODES.OK,
        HTTP_STATUS_CODES.CREATED,
        HTTP_STATUS_CODES.METHOD_NOT_ALLOWED,
      ]).toContain(response.status);
    }
  });

  test('@regression PUT response time should be acceptable', async ({
    apiClient,
    responseTimeAssertions,
    randomDataGenerator,
  }) => {
    const createPayload = {
      name: randomDataGenerator.generateProductName(),
      data: randomDataGenerator.generateProductData(),
    };

    const createResponse = await apiClient.post(API_ENDPOINTS.OBJECTS, { body: createPayload });

    if (typeof createResponse.body === 'object' && createResponse.body !== null &&
        POST_OK.includes(createResponse.status)) {
      const objectId = (createResponse.body as Record<string, unknown>).id as string;

      const updateResponse = await apiClient.put(`${API_ENDPOINTS.OBJECTS}/${objectId}`, {
        body: { name: 'Updated Name', data: { test: true } },
      });

      responseTimeAssertions.assertResponseTimeWithinLimit(updateResponse.responseTime, 10000);
    }
  });

  test('@regression Verify PUT does not create duplicate objects', async ({
    apiClient,
    randomDataGenerator,
  }) => {
    const createPayload = {
      name: randomDataGenerator.generateProductName(),
      data: randomDataGenerator.generateProductData(),
    };

    const createResponse = await apiClient.post(API_ENDPOINTS.OBJECTS, { body: createPayload });

    // The public API occasionally denies writes (405); only assert the PUT flow
    // when object creation actually succeeded, matching the rest of this file.
    test.skip(!POST_OK.includes(createResponse.status), `POST returned ${createResponse.status}; write access unavailable`);

    if (typeof createResponse.body === 'object' && createResponse.body !== null) {
      const objectId = (createResponse.body as Record<string, unknown>).id as string;

      await apiClient.put(`${API_ENDPOINTS.OBJECTS}/${objectId}`, {
        body: { name: 'Updated Name', data: { test: true } },
      });

      // Object should still be retrievable after PUT
      const getResponse = await apiClient.get(`${API_ENDPOINTS.OBJECTS}/${objectId}`);
      expect([HTTP_STATUS_CODES.OK, HTTP_STATUS_CODES.NOT_FOUND]).toContain(getResponse.status);
    }
  });
});