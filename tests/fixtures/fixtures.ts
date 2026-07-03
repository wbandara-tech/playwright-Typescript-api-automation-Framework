import { test as base } from '@playwright/test';
import { APIClient } from '../../src/api/APIClient';
import { ResponseValidator } from '../../src/validators/ResponseValidator';
import { RandomDataGenerator } from '../../src/utils/RandomDataGenerator';
import { ResponseTimeAssertions } from '../../src/utils/ResponseTimeAssertions';
import { logger } from '../../src/config/Logger';

// Custom fixture types — each test receives pre-built, typed instances via DI
type TestFixtures = {
  apiClient: APIClient;
  responseValidator: typeof ResponseValidator;
  randomDataGenerator: typeof RandomDataGenerator;
  responseTimeAssertions: typeof ResponseTimeAssertions;
};

export const test = base.extend<TestFixtures>({
  // Provides a fresh APIClient scoped to the current Playwright request context
  apiClient: async ({ request }, use: (arg: APIClient) => Promise<void>) => {
    const apiClient = new APIClient(request);
    logger.info('APIClient initialized');
    await use(apiClient);
    logger.info('APIClient test completed');
  },

  // Static class — shared across all tests without instantiation
  responseValidator: async ({}, use: (arg: typeof ResponseValidator) => Promise<void>) => {
    await use(ResponseValidator);
  },

  randomDataGenerator: async ({}, use: (arg: typeof RandomDataGenerator) => Promise<void>) => {
    await use(RandomDataGenerator);
  },

  responseTimeAssertions: async ({}, use: (arg: typeof ResponseTimeAssertions) => Promise<void>) => {
    await use(ResponseTimeAssertions);
  },
});

export { expect } from '@playwright/test';
