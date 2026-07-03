import { test } from '../fixtures/fixtures';
import { API_ENDPOINTS } from '../../src/config/Constants';

// POST tests verify resource creation: correct status codes, generated IDs, data persistence, and error handling
// Note: this API returns 200 (not 201) for successful creation
test.describe('@api @post POST Endpoint Tests', () => {

  test('@regression POST response time should be acceptable', async ({
    apiClient,
    responseTimeAssertions,
    randomDataGenerator,
  }) => {
    const payload = { name: randomDataGenerator.generateProductName(), data: randomDataGenerator.generateProductData() };

    const response = await apiClient.post(API_ENDPOINTS.OBJECTS, { body: payload });

    responseTimeAssertions.assertResponseTimeWithinLimit(response.responseTime, 10000);
  });
});