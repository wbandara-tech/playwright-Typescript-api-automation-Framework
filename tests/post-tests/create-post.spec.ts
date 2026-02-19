import { test, expect } from "../../src/fixtures";
import { PostResponse, CreatePostRequest } from "../../src/models";
import { assertStatusCode, generateCreatePostRequest } from "../../src/utils";

/**
 * Tests for POST /posts endpoint.
 * Covers: creating posts with valid data, random data, and data-driven tests.
 *
 * @author wbandara-tech
 */
test.describe("Create Posts @posts @post", () => {
  test("POST /posts creates a new post and returns 201 @smoke", async ({ postService }) => {
    // Arrange
    const newPost: CreatePostRequest = {
      title: "Test Post Title",
      body: "This is the body of the test post.",
      userId: 1,
    };

    // Act
    const response = await postService.createPost(newPost);

    // Assert
    assertStatusCode(response, 201);

    const result: PostResponse = await response.json();
    expect(result.title).toBe(newPost.title);
    expect(result.body).toBe(newPost.body);
    expect(result.userId).toBe(newPost.userId);
    expect(result.id).toBeGreaterThan(0);
  });

  test("POST /posts with random data creates post correctly @smoke", async ({ postService }) => {
    // Arrange
    const newPost = generateCreatePostRequest();

    // Act
    const response = await postService.createPost(newPost);

    // Assert
    assertStatusCode(response, 201);

    const result: PostResponse = await response.json();
    expect(result.title).toBe(newPost.title);
    expect(result.body).toBe(newPost.body);
    expect(result.userId).toBe(newPost.userId);
  });

  const testCases = [
    { title: "First Post", body: "Body of first post", userId: 1 },
    { title: "Second Post", body: "Body of second post", userId: 2 },
    { title: "Third Post", body: "Body of third post", userId: 3 },
  ];

  for (const { title, body, userId } of testCases) {
    test(`POST /posts works with data: ${title}`, async ({ postService }) => {
      // Arrange
      const newPost: CreatePostRequest = { title, body, userId };

      // Act
      const response = await postService.createPost(newPost);

      // Assert
      assertStatusCode(response, 201);

      const result: PostResponse = await response.json();
      expect(result.title).toBe(title);
      expect(result.body).toBe(body);
      expect(result.userId).toBe(userId);
    });
  }
});
