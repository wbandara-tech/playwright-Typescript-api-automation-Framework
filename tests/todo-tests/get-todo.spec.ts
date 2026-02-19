import { test, expect } from "../../src/fixtures";
import { TodoResponse } from "../../src/models";
import { assertStatusCode } from "../../src/utils";

/**
 * Tests for GET /todos and GET /todos/{id} endpoints.
 * Covers: list todos, single todo, filter by user, and not found.
 *
 * @author wbandara-tech
 */
test.describe("Get Todos @todos @get", () => {
  test("GET /todos returns list of 200 todos @smoke", async ({ todoService }) => {
    // Act
    const response = await todoService.getTodos();

    // Assert
    assertStatusCode(response, 200);

    const todos: TodoResponse[] = await response.json();
    expect(todos).toHaveLength(200);
    for (const todo of todos) {
      expect(todo.id).toBeGreaterThan(0);
      expect(todo.userId).toBeGreaterThan(0);
      expect(todo.title).toBeTruthy();
    }
  });

  test("GET /todos/1 returns a single todo @smoke", async ({ todoService }) => {
    // Arrange
    const todoId = 1;

    // Act
    const response = await todoService.getTodoById(todoId);

    // Assert
    assertStatusCode(response, 200);

    const todo: TodoResponse = await response.json();
    expect(todo.id).toBe(todoId);
    expect(todo.userId).toBeGreaterThan(0);
    expect(todo.title).toBeTruthy();
  });

  test("GET /todos?userId=1 returns only todos for user 1", async ({ todoService }) => {
    // Arrange
    const userId = 1;

    // Act
    const response = await todoService.getTodosByUserId(userId);

    // Assert
    assertStatusCode(response, 200);

    const todos: TodoResponse[] = await response.json();
    expect(todos.length).toBeGreaterThan(0);
    for (const todo of todos) {
      expect(todo.userId).toBe(userId);
    }
  });

  test("GET /todos/999 returns 404 for non-existent todo @negative", async ({ todoService }) => {
    // Act
    const response = await todoService.getTodoById(999);

    // Assert
    assertStatusCode(response, 404);
  });

  test("GET /todos contains both completed and incomplete items", async ({ todoService }) => {
    // Act
    const response = await todoService.getTodos();

    // Assert
    assertStatusCode(response, 200);

    const todos: TodoResponse[] = await response.json();
    const hasCompleted = todos.some((t) => t.completed === true);
    const hasIncomplete = todos.some((t) => t.completed === false);
    expect(hasCompleted).toBe(true);
    expect(hasIncomplete).toBe(true);
  });
});
