import { test as base } from "@playwright/test";
import { PostApiService, UserApiService, TodoApiService } from "../services";

/**
 * Custom Playwright fixtures extending the base test with
 * pre-initialised service objects.
 *
 * Industrial-standard pattern: fixtures provide dependency injection
 * so tests never need to manually instantiate services.
 *
 * Usage in tests:
 *   import { test, expect } from "../../src/fixtures/api.fixtures";
 *
 * @author wbandara-tech
 */

/** Fixture type declarations */
type ApiFixtures = {
  postService: PostApiService;
  userService: UserApiService;
  todoService: TodoApiService;
};

/**
 * Extended test object with API service fixtures.
 * Each fixture is lazily initialised per test — guaranteeing isolation.
 */
export const test = base.extend<ApiFixtures>({
  postService: async ({ request }, use) => {
    const service = new PostApiService(request);
    await use(service);
  },

  userService: async ({ request }, use) => {
    const service = new UserApiService(request);
    await use(service);
  },

  todoService: async ({ request }, use) => {
    const service = new TodoApiService(request);
    await use(service);
  },
});

export { expect } from "@playwright/test";
