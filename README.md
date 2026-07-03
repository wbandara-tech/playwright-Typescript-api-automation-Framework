# Playwright API Automation Framework

An enterprise-grade, production-ready API automation framework built with Playwright and TypeScript for testing RESTful APIs. This framework demonstrates senior-level test automation engineering practices, including SOLID principles, clean code architecture, and comprehensive test coverage.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Generating Reports](#generating-reports)
- [Allure Report](#allure-report)
- [HTML Report](#html-report)
- [GitHub Actions](#github-actions)
- [Architecture](#architecture)
- [Best Practices](#best-practices)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Project Overview

This framework is designed to automate API testing for the [RESTful API Dev](https://restful-api.dev/) service. It covers comprehensive test scenarios including:

- **GET Operations** - Retrieve resources and verify response structure, headers, and performance
- **POST Operations** - Create resources with validation of status codes, generated IDs, and data persistence
- **PUT Operations** - Update existing resources and verify data consistency
- **DELETE Operations** - Remove resources and verify successful deletion and idempotency
- **Negative Scenarios** - Handle edge cases, invalid inputs, and error conditions

The framework emphasizes maintainability, reusability, and scalability through:

- Modular component architecture
- Comprehensive logging and error handling
- Configurable test environments
- Parallel test execution
- Multiple reporting formats
- CI/CD integration

## Features

✅ **Comprehensive Test Coverage**
- 50+ test cases covering positive and negative scenarios
- GET, POST, PUT, DELETE HTTP method coverage
- Edge case and error condition testing

✅ **Enterprise Architecture**
- SOLID principles implementation
- DRY (Don't Repeat Yourself) principle adherence
- Separation of concerns
- Reusable components and utilities

✅ **Type Safety**
- Full TypeScript implementation with strict type checking
- Strong typing for all API models and responses
- Compile-time error detection

✅ **Advanced Logging**
- Configurable log levels (DEBUG, INFO, WARN, ERROR)
- Request/response logging with timestamps
- Performance metrics tracking

✅ **Multiple Reporting Formats**
- Playwright HTML Report
- Allure Report with rich visualizations
- JUnit XML for CI/CD integration
- JSON report format

✅ **Environment Management**
- Multi-environment configuration (.env.dev, .env.qa)
- Centralized configuration loader
- No hardcoded URLs or credentials

✅ **CI/CD Ready**
- GitHub Actions workflow included
- Artifact upload and reporting
- Parallel test execution support

## Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Playwright** | ^1.48.2 | Web & API testing framework |
| **TypeScript** | ^5.6.2 | Type-safe JavaScript |
| **Node.js** | >=18.0.0 | JavaScript runtime |
| **npm** | >=9.0.0 | Package manager |
| **dotenv** | ^16.4.5 | Environment configuration |
| **allure-playwright** | ^2.14.0 | Allure reporting integration |

## Project Structure

```
playwright-api-automation-framework/
├── .github/
│   └── workflows/
│       └── api-tests.yml                 # GitHub Actions CI/CD workflow
├── src/
│   ├── api/
│   │   └── APIClient.ts                  # Core API client with retry logic
│   ├── config/
│   │   ├── ConfigLoader.ts               # Environment configuration management
│   │   ├── Logger.ts                     # Centralized logging utility
│   │   └── Constants.ts                  # API endpoints and constants
│   ├── models/
│   │   ├── Product.ts                    # Product data models
│   │   └── Http.ts                       # HTTP request/response types
│   ├── utils/
│   │   ├── RandomDataGenerator.ts        # Test data generation utility
│   │   ├── JsonSchemaValidator.ts        # JSON schema validation
│   │   └── ResponseTimeAssertions.ts     # Performance assertions
│   └── validators/
│       └── ResponseValidator.ts          # Response validation helper
├── tests/
│   ├── api/
│   │   ├── get.spec.ts                   # GET endpoint tests
│   │   ├── post.spec.ts                  # POST endpoint tests
│   │   ├── put.spec.ts                   # PUT endpoint tests
│   │   ├── delete.spec.ts                # DELETE endpoint tests
│   │   ├── negative.spec.ts              # Negative test scenarios
│   │   └── testData.ts                   # Test data definitions
│   └── fixtures/
│       └── fixtures.ts                   # Reusable test fixtures
├── playwright-report/                    # Playwright HTML reports (generated)
├── allure-results/                       # Allure report data (generated)
├── test-results/                         # Test results in multiple formats (generated)
├── .env.example                          # Environment variables template
├── .env.dev                              # Development environment config
├── .env.qa                               # QA environment config
├── .gitignore                            # Git ignore rules
├── package.json                          # Project dependencies
├── playwright.config.ts                  # Playwright configuration
├── tsconfig.json                         # TypeScript configuration
└── README.md                             # This file
```

## Prerequisites

- **Node.js** 18.x or higher (LTS recommended)
- **npm** 9.x or higher
- **Git** for version control
- Modern OS: Windows, macOS, or Linux
- Internet connection for API testing

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/wbandara-tech/playwright-api-automation-framework.git
cd playwright-api-automation-framework
```

### 2. Install Dependencies

```bash
npm install
```

This will install:
- Playwright and its test runner
- TypeScript compiler
- Allure CLI for report generation
- dotenv for environment management

### 3. Install Playwright Browsers

```bash
npx playwright install
```

### 4. Verify Installation

```bash
npm run type-check
```

If no errors appear, the installation is successful.

## Environment Configuration

The framework uses environment-based configuration to support multiple environments without code changes.

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `BASE_URL` | `https://restful-api.dev` | API base URL |
| `API_TIMEOUT` | `30000` | Request timeout in milliseconds |
| `RETRY_COUNT` | `2` | Number of retry attempts |
| `LOG_LEVEL` | `info` | Logging level (debug, info, warn, error) |

### Setup Environment Files

1. **Development Environment** (.env.dev)
   ```bash
   BASE_URL=https://restful-api.dev
   API_TIMEOUT=30000
   RETRY_COUNT=2
   LOG_LEVEL=debug
   ```

2. **QA Environment** (.env.qa)
   ```bash
   BASE_URL=https://restful-api.dev
   API_TIMEOUT=30000
   RETRY_COUNT=2
   LOG_LEVEL=info
   ```

3. **Custom Environment**
   ```bash
   cp .env.example .env.custom
   # Edit .env.custom with your values
   NODE_ENV=custom npm test
   ```

### Loading Configuration

Configuration is automatically loaded based on `NODE_ENV`:

```bash
NODE_ENV=dev npm test      # Uses .env.dev
NODE_ENV=qa npm test       # Uses .env.qa
npm test                   # Uses .env.dev (default)
```

## Running Tests

### Run All Tests

```bash
npm test
```

Executes all test files in parallel with reporting.

### Run Specific Test Suite

```bash
# Run only GET tests
npm test -- --grep "@get"

# Run only POST tests
npm test -- --grep "@post"

# Run only smoke tests
npm run test:smoke

# Run regression tests
npm run test:regression
```

### Run Tests in Different Modes

```bash
# Run with visible browser (headed mode)
npm run test:headed

# Run with debugging
npm run test:debug

# Run single test file
npm test tests/api/get.spec.ts

# Run with specific configuration
npm test -- --project=chromium
```

### Test Filtering

Tests are tagged with decorators for easy filtering:

```bash
# Run API tests
npm run test:api

# Run smoke tests (quick sanity checks)
npm run test:smoke
@smoke GET endpoint returns status 200
@smoke Create new object with valid data

# Run regression tests (comprehensive coverage)
@regression <most tests>

# Run negative tests
@negative Invalid endpoint returns error
```

## Test Coverage

### Coverage Summary

| HTTP Method | Test Count | Scenarios |
|------------|-----------|-----------|
| **GET** | 10 | Retrieve all, by ID, headers, response time, idempotency, structure |
| **POST** | 10 | Create, validation, duplicates, invalid payloads, persistence |
| **PUT** | 8 | Update, partial updates, invalid data, non-existent resources |
| **DELETE** | 8 | Delete, idempotency, removal verification, error handling |
| **Negative** | 20 | Invalid endpoints, malformed data, edge cases, security |
| **Total** | **56** | Comprehensive API testing |

### Test Categories

#### Positive Tests
- Valid request/response flows
- Success scenarios
- Data persistence verification
- Response structure validation

#### Negative Tests
- Invalid IDs and endpoints
- Malformed payloads
- SQL injection attempts
- Unicode and special characters
- Large payloads
- Missing required fields

#### Performance Tests
- Response time validation
- Timeout handling
- Retry logic verification
- Concurrent request handling

## Generating Reports

### Generate HTML Report

```bash
npm run report
```

Opens the Playwright HTML report in your default browser showing:
- Test execution timeline
- Pass/fail statistics
- Error details and stack traces
- Screenshots and videos (if configured)

### Generate Allure Report

```bash
npm run allure:report
```

Creates comprehensive Allure report with:
- Test execution history
- Detailed test results
- Environment information
- Failed test analysis
- Test durations and trends

### View Allure Report

```bash
npm run allure:open
```

Opens Allure report in browser at `http://localhost:4200`

### Report Artifacts

After test execution, reports are generated in:

```
├── playwright-report/          # Playwright HTML report
│   └── index.html             # Open in browser
├── allure-results/            # Allure raw data
├── allure-report/             # Allure HTML (after generation)
└── test-results/
    ├── junit.xml              # JUnit format for CI/CD
    ├── results.json           # JSON format results
    └── results.html           # HTML summary
```

## Allure Report

Allure provides detailed test reporting with:

### Features

- **Test History** - Track test results over time
- **Flaky Tests** - Identify inconsistent tests
- **Categories** - Organize tests by type
- **Trends** - Visualize pass/fail trends
- **Environment** - Display test environment details

### Installation & Setup

```bash
# Already included in package.json
npm install

# Or install globally
npm install -g allure-commandline
```

### Commands

```bash
# Generate report from results
npm run allure

# Generate and open in browser
npm run allure:report

# Open existing report
npm run allure:open

# Clean allure results
allure clean
```

## HTML Report

Playwright's built-in HTML report includes:

- **Test Timeline** - Visual representation of test execution
- **Pass/Fail Summary** - Quick overview of results
- **Failed Tests** - Detailed error information and logs
- **Browser/Platform** - Test environment details

```bash
# Generate and open
npm run report

# View existing report
npx playwright show-report
```

## GitHub Actions

### Workflow Overview

The CI/CD pipeline automatically runs on:
- Push to main or develop branches
- Pull requests to main or develop branches

### Workflow Steps

1. **Checkout** - Clone repository
2. **Setup Node.js** - Configure Node.js 18
3. **Install Dependencies** - npm ci
4. **Install Browsers** - Playwright browsers
5. **Run Tests** - Execute all tests
6. **Generate Reports** - Allure and HTML reports
7. **Upload Artifacts** - Archive reports and results

### Workflow File

Located at `.github/workflows/api-tests.yml`

### Accessing Artifacts

1. Go to GitHub Actions in repository
2. Select latest workflow run
3. Download artifacts (HTML report, test results, Allure data)

### Workflow Configuration

```yaml
# Modify for your needs
- Matrix testing across browsers
- Schedule tests (cron)
- Manual trigger (workflow_dispatch)
- Conditional steps
```

## Architecture

### Design Principles

#### SOLID Principles

- **S**ingle Responsibility - Each class has one reason to change
- **O**pen/Closed - Open for extension, closed for modification
- **L**iskov Substitution - Derived classes can substitute base classes
- **I**nterface Segregation - Clients depend on specific interfaces
- **D**ependency Inversion - Depend on abstractions, not concretions

#### Clean Code Practices

- Meaningful naming conventions
- Small, focused methods
- No code duplication
- Comprehensive error handling
- Type safety with TypeScript
- Readable test assertions

### Core Components

#### APIClient
The central HTTP client handles:
- Request/response management
- Automatic retry logic
- Performance tracking
- Error handling and logging
- Header and authentication management

#### ConfigLoader
Manages environment configuration:
- Multi-environment support
- Safe default values
- Singleton pattern
- Type-safe configuration access

#### Logger
Provides structured logging:
- Configurable log levels
- Timestamp tracking
- Request/response logging
- Error context capture

#### Validators
Encapsulate validation logic:
- Response structure validation
- HTTP status code verification
- Header validation
- Performance assertions
- JSON schema validation

#### Fixtures
Playwright fixtures provide:
- Dependency injection
- Resource setup/teardown
- Reusable test utilities
- Type-safe test data

### Request/Response Flow

```
Test Case
    ↓
Fixture (APIClient)
    ↓
APIClient.request(method, endpoint, options)
    ↓
Build URL, Headers, Options
    ↓
Logger (request details)
    ↓
Retry Loop (with backoff)
    ↓
Playwright RequestContext.fetch()
    ↓
Parse Response (JSON/Text)
    ↓
Logger (response details)
    ↓
Return HttpResponse
    ↓
Validators (assertions)
    ↓
Test Passes/Fails
```

## Best Practices

### Test Design

✅ **DO**
- Use meaningful test names that describe what is being tested
- Follow AAA pattern: Arrange, Act, Assert
- Test one concept per test
- Use fixtures for dependency injection
- Maintain test data separation

❌ **DON'T**
- Hardcode URLs or credentials
- Create tests with side effects
- Ignore flaky test failures
- Skip error cases
- Duplicate test logic

### Code Quality

✅ **DO**
- Use strong typing with TypeScript
- Keep methods small and focused
- Extract reusable utilities
- Handle errors gracefully
- Log important operations

❌ **DON'T**
- Use `any` type unnecessarily
- Create large test methods
- Duplicate similar test cases
- Ignore error handling
- Write cryptic variable names

### Performance

✅ **DO**
- Run tests in parallel
- Use appropriate timeouts
- Cache static data
- Minimize external dependencies

❌ **DON'T**
- Make unnecessary requests
- Use excessive wait times
- Create dependent tests
- Run all tests serially

## Contributing

### Code Style

- Follow ESLint recommendations (configured in TypeScript)
- Use Prettier for code formatting
- Maintain 100% TypeScript strict mode compliance

### Adding New Tests

1. Create new `.spec.ts` file in `tests/api/`
2. Import fixtures and utilities
3. Use meaningful test names with tags
4. Follow existing test patterns
5. Add assertions using ResponseValidator
6. Update test count in README

### Example New Test

```typescript
import { test, expect } from '../fixtures/fixtures';
import { API_ENDPOINTS, HTTP_STATUS_CODES } from '../../src/config/Constants';

test.describe('@api @custom Custom Feature Tests', () => {
  test('@smoke Your descriptive test name', async ({ apiClient, randomDataGenerator }) => {
    // Arrange
    const payload = {
      name: randomDataGenerator.generateProductName(),
      data: randomDataGenerator.generateProductData(),
    };

    // Act
    const response = await apiClient.post(API_ENDPOINTS.OBJECTS, { body: payload });

    // Assert
    expect(response.status).toBe(HTTP_STATUS_CODES.CREATED);
  });
});
```

## Troubleshooting

### Common Issues

#### Issue: Tests timeout
**Solution**: Increase `API_TIMEOUT` in `.env` file or specific test

```typescript
const response = await apiClient.get(endpoint, { timeout: 60000 });
```

#### Issue: Port 3000 already in use (Allure)
**Solution**: Kill process or use different port

```bash
# Linux/macOS
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

#### Issue: Playwright browsers not installed
**Solution**: Reinstall browsers

```bash
npx playwright install
```

#### Issue: TypeScript compilation errors
**Solution**: Type check and rebuild

```bash
npm run type-check
npm install --save-dev typescript
```

## Future Improvements

- [ ] Database integration for test data management
- [ ] Visual regression testing
- [ ] Performance baseline tracking
- [ ] Advanced test data builders using factory pattern
- [ ] Mock API server for offline testing
- [ ] Multi-environment parallel execution
- [ ] Slack/email integration for notifications
- [ ] Browser testing integration
- [ ] Load and stress testing capabilities
- [ ] Test-to-requirement traceability matrix
- [ ] Advanced retry strategies
- [ ] API contract testing

## Author

**Wasantha Bandara**

- GitHub: [@wbandara-tech](https://github.com/wbandara-tech)
- Repository: [playwright-api-automation-framework](https://github.com/wbandara-tech/playwright-api-automation-framework)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Resources

- [Playwright Official Documentation](https://playwright.dev/)
- [Playwright API Testing Guide](https://playwright.dev/docs/api-testing)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RESTful API Dev](https://restful-api.dev/)
- [Allure Report Documentation](https://docs.qameta.io/allure/)

## Support

For issues, questions, or suggestions:

1. Check existing GitHub issues
2. Review troubleshooting section
3. Create detailed issue with reproduction steps
4. Include environment details and logs

---

**Last Updated**: July 2024  
**Framework Version**: 1.0.0  
**Node Version**: 18+  
**Playwright Version**: 1.48.2+
