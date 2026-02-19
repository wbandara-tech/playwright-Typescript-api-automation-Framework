# 🎭 Playwright TypeScript API Automation Demo

A modern API test automation framework built with **Playwright for TypeScript**, demonstrating best practices for API testing including service object pattern, structured logging, Allure reporting, and CI/CD integration.

---

### 🔗 Quick Links

| Resource | Link |
|----------|------|
| 📊 **Test Report** | [Allure Report on GitHub Pages](https://wbandara-tech.github.io/playwright-Typescript-api-automation-Framework) |
| ⚙️ **CI/CD Pipeline** | [GitHub Actions Runs](https://github.com/wbandara-tech/playwright-Typescript-api-automation-Framework/actions) |
| 💻 **Source Code** | [GitHub Repository](https://github.com/wbandara-tech/playwright-Typescript-api-automation-Framework) |

---

## 🏗️ Project Structure

```
├── src/
│   ├── base/                       # Logger infrastructure
│   │   └── logger.ts               # Winston structured logging
│   ├── config/                     # Centralised configuration
│   │   └── api.config.ts           # Endpoints, headers, environment settings
│   ├── fixtures/                   # Custom Playwright fixtures (DI)
│   │   └── api.fixtures.ts         # postService, userService, todoService
│   ├── models/                     # Request/Response type definitions
│   │   ├── request.models.ts       # CreatePostRequest, UpdatePostRequest
│   │   └── response.models.ts      # PostResponse, UserResponse, etc.
│   ├── services/                   # Service Object Pattern (API abstraction)
│   │   ├── post-api.service.ts     # Post CRUD operations
│   │   ├── user-api.service.ts     # User read operations
│   │   └── todo-api.service.ts     # Todo read operations
│   └── utils/                      # Helpers & extensions
│       ├── assertion-helpers.ts    # Custom assertion helper functions
│       └── test-data-generator.ts  # Random test data via @faker-js/faker
├── tests/                          # Test specs organized by feature
│   ├── post-tests/                 # GET, POST, PUT, PATCH, DELETE posts
│   │   ├── get-post.spec.ts
│   │   ├── create-post.spec.ts
│   │   ├── update-post.spec.ts
│   │   └── delete-post.spec.ts
│   ├── todo-tests/                 # GET todos
│   │   └── get-todo.spec.ts
│   └── user-tests/                 # GET users
│       └── get-user.spec.ts
├── .github/workflows/              # CI/CD pipeline
│   └── api-tests.yml               # GitHub Actions + Allure deployment
├── playwright.config.ts            # Playwright & test configuration
├── tsconfig.json                   # TypeScript configuration
├── .env.example                    # Environment template
└── package.json                    # Dependencies & scripts
```

## 🚀 Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js 20+** | Runtime |
| **TypeScript 5** | Type-safe test code |
| **Playwright** | HTTP client for API testing |
| **@faker-js/faker** | Fake test data generation |
| **Winston** | Structured logging (console + file) |
| **Allure** | Test reporting |

## 📋 Prerequisites

- [Node.js 20+](https://nodejs.org/)
- npm (bundled with Node.js)

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/wbandara-tech/playwright-Typescript-api-automation-Framework.git
cd playwright-Typescript-api-automation-Framework

# 2. Install dependencies
npm install

# 3. Install Playwright
npx playwright install

# 4. Run all tests
npx playwright test

# 5. Run tests with UI mode
npx playwright test --ui
```

## 🧪 Running Tests

```bash
# Run all tests
npx playwright test

# Run specific tag
npx playwright test --grep @smoke
npx playwright test --grep @posts
npx playwright test --grep @users
npx playwright test --grep @todos
npx playwright test --grep @negative

# Run a specific test file
npx playwright test tests/post-tests/create-post.spec.ts

# Run with verbose output
npx playwright test --reporter=list

# Run with HTML report
npx playwright test --reporter=html
npx playwright show-report
```

## 📊 Test API (JSONPlaceholder)

This project uses [JSONPlaceholder](https://jsonplaceholder.typicode.com) — a free, no-auth-required fake REST API:

| Endpoint | Method | Description |
|---|---|---|
| `/posts` | GET | List all posts (100 items) |
| `/posts/{id}` | GET | Single post |
| `/posts?userId={id}` | GET | Posts by user |
| `/posts/{id}/comments` | GET | Comments for a post |
| `/posts` | POST | Create post |
| `/posts/{id}` | PUT | Update post (full) |
| `/posts/{id}` | PATCH | Update post (partial) |
| `/posts/{id}` | DELETE | Delete post |
| `/users` | GET | List all users (10 items) |
| `/users/{id}` | GET | Single user |
| `/todos` | GET | List all todos (200 items) |
| `/todos/{id}` | GET | Single todo |

## 🔧 Configuration

All test configuration lives in `playwright.config.ts`:

```ts
use: {
  baseURL: process.env.BASE_URL || "https://jsonplaceholder.typicode.com",
  extraHTTPHeaders: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
},
```

Override via environment variables: `BASE_URL=https://your-api.com npx playwright test`

## 📝 Key Design Patterns

- **Service Object Pattern** — API operations encapsulated in service classes
- **Custom Playwright Fixtures** — Dependency injection via `test.extend<>()` for all services
- **Centralised Configuration** — Endpoints & env settings in `src/config/`
- **Data-Driven Testing** — Parameterized tests + @faker-js/faker random data
- **Structured Logging** — Winston console + file logging
- **Typed Models** — TypeScript interfaces for request/response contracts
- **Allure Reporting** — Rich test reports deployed to GitHub Pages

## 📊 Allure Reporting

```bash
# After running tests, generate and view the report:
npx allure serve allure-results
```

## 🔄 CI/CD

GitHub Actions workflow runs on push to `main`/`develop` and on PRs. See `.github/workflows/api-tests.yml`.

## 📜 License

MIT
