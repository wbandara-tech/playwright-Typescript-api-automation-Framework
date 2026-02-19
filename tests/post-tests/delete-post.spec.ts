import { test } from "../../src/fixtures";
import { assertStatusCode } from "../../src/utils";

/**
 * Tests for DELETE /posts/{id} endpoint.
 *
 * @author wbandara-tech
 */
test.describe("Delete Posts @posts @delete", () => {
  test("DELETE /posts/{id} deletes a post and returns 200 @smoke", async ({ postService }) => {
    // Arrange
    const postId = 1;

    // Act
    const response = await postService.deletePost(postId);

    // Assert
    assertStatusCode(response, 200);
  });

  const testCaseIds = [1, 50, 100];

  for (const postId of testCaseIds) {
    test(`DELETE /posts/${postId} returns 200`, async ({ postService }) => {
      // Act
      const response = await postService.deletePost(postId);

      // Assert
      assertStatusCode(response, 200);
    });
  }
});
