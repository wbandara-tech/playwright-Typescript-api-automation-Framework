/**
 * Centralized API configuration.
 * All endpoint paths and environment settings are managed here.
 *
 * @author wbandara-tech
 */

export const ApiConfig = {
  /** Base URL — can be overridden via BASE_URL env variable */
  baseUrl:
    process.env.BASE_URL || "https://jsonplaceholder.typicode.com",

  /** Timeout for individual API requests (ms) */
  requestTimeout: 30_000,

  /** HTTP Headers */
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
} as const;

/**
 * Centralised endpoint paths — single source of truth for all API routes.
 */
export const Endpoints = {
  posts: {
    base: "/posts",
    byId: (id: number) => `/posts/${id}`,
    byUserId: (userId: number) => `/posts?userId=${userId}`,
    comments: (postId: number) => `/posts/${postId}/comments`,
  },
  users: {
    base: "/users",
    byId: (id: number) => `/users/${id}`,
  },
  todos: {
    base: "/todos",
    byId: (id: number) => `/todos/${id}`,
    byUserId: (userId: number) => `/todos?userId=${userId}`,
  },
} as const;
