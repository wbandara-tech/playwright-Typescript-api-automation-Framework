# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Clone and Setup
```bash
cd c:\Users\btwas\OneDrive\Desktop\playwright-api-assessment
npm install
npx playwright install --with-deps
```

### 2. Verify Installation
```bash
npm run type-check
```

### 3. Run Tests
```bash
npm test
```

### 4. View Reports
```bash
npm run report
```

---

## 📋 Available Commands

```bash
# Test Execution
npm test                  # Run all tests
npm run test:api         # Run only API tests
npm run test:smoke       # Run smoke tests
npm run test:regression  # Run regression tests
npm run test:headed      # Run with visible browser
npm run test:debug       # Debug mode

# Reports
npm run report           # View Playwright HTML report
npm run allure          # Generate Allure report
npm run allure:report   # Generate and open Allure
npm run allure:open     # Open existing Allure report

# Code Quality
npm run type-check      # TypeScript type checking
npm run lint            # ESLint (if configured)
```

---

## 📁 Project Structure

- **src/** - Framework source code
  - `api/` - APIClient (HTTP requests)
  - `config/` - Configuration & logging
  - `models/` - Data types
  - `utils/` - Utilities & helpers
  - `validators/` - Response validators

- **tests/** - Test specifications
  - `api/` - API test suites
  - `fixtures/` - Reusable fixtures

- **Configuration Files**
  - `.env.dev` - Development environment
  - `.env.qa` - QA environment
  - `.env.example` - Template
  - `playwright.config.ts` - Playwright settings
  - `tsconfig.json` - TypeScript settings

---

## 🧪 Test Structure

Each test file follows the same pattern:

```typescript
import { test, expect } from '../fixtures/fixtures';

test.describe('@api @get GET Endpoint Tests', () => {
  test('@smoke Test description', async ({ apiClient }) => {
    // Arrange
    const response = await apiClient.get('/endpoint');
    
    // Assert
    expect(response.status).toBe(200);
  });
});
```

---

## 📊 Reports

### Playwright HTML Report
- **Location**: `playwright-report/index.html`
- **Contains**: Test timeline, pass/fail stats, errors
- **Command**: `npm run report`

### Allure Report
- **Location**: `allure-results/` or `allure-report/`
- **Contains**: History, trends, detailed results
- **Command**: `npm run allure:report`

### JUnit XML
- **Location**: `test-results/junit.xml`
- **Use**: CI/CD integration

---

## 🔧 Environment Configuration

### Development
```bash
NODE_ENV=dev npm test
# Uses .env.dev with DEBUG log level
```

### QA
```bash
NODE_ENV=qa npm test
# Uses .env.qa with INFO log level
```

### Custom
```bash
# Edit .env or create .env.custom
npm test
```

---

## 🎯 Test Filtering

Run specific tests with grep patterns:

```bash
# Smoke tests only
npm test -- --grep "@smoke"

# Regression tests
npm test -- --grep "@regression"

# Negative tests
npm test -- --grep "@negative"

# GET endpoints only
npm test -- --grep "@get"

# Combination
npm test -- --grep "@api @post"
```

---

## 📝 Adding New Tests

1. Create file: `tests/api/mytest.spec.ts`
2. Use template:
```typescript
import { test, expect } from '../fixtures/fixtures';
import { API_ENDPOINTS, HTTP_STATUS_CODES } from '../../src/config/Constants';

test.describe('@api @myfeature New Feature Tests', () => {
  test('@smoke My test', async ({ apiClient, randomDataGenerator }) => {
    const response = await apiClient.get(API_ENDPOINTS.OBJECTS);
    expect(response.status).toBe(HTTP_STATUS_CODES.OK);
  });
});
```
3. Run: `npm test -- --grep "@myfeature"`

---

## 🐛 Troubleshooting

### Tests not found
```bash
npm test -- --list  # List all tests
```

### TypeScript errors
```bash
npm run type-check
```

### Playwright browser issues
```bash
npx playwright install --with-deps
```

### Port already in use (Allure)
```bash
npm run allure:report  # Will use available port
```

---

## 📚 File Reference

| File | Purpose |
|------|---------|
| `src/api/APIClient.ts` | HTTP client |
| `src/config/ConfigLoader.ts` | Configuration |
| `src/config/Logger.ts` | Logging |
| `tests/fixtures/fixtures.ts` | Test fixtures |
| `tests/api/get.spec.ts` | GET tests |
| `tests/api/post.spec.ts` | POST tests |
| `tests/api/put.spec.ts` | PUT tests |
| `tests/api/delete.spec.ts` | DELETE tests |
| `tests/api/negative.spec.ts` | Negative tests |

---

## ✅ Pre-execution Checklist

Before running tests:
- [ ] Node.js 18+ installed
- [ ] npm dependencies installed (`npm install`)
- [ ] Playwright browsers installed (`npx playwright install`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Environment file exists (`.env.dev`, `.env.qa`, or `.env`)

---

## 🔗 Additional Resources

- **README.md** - Complete documentation
- **IMPLEMENTATION_SUMMARY.md** - Implementation details
- **Playwright Docs** - https://playwright.dev
- **restful-api.dev** - https://restful-api.dev

---

## 💡 Tips

1. **Run tests in parallel** - Playwright does this automatically
2. **Use grep for filtering** - Faster than running all tests
3. **Check logs** - LOG_LEVEL=debug for more details
4. **View reports** - Always check reports for insights
5. **Update tests** - Add new tests to improve coverage

---

**Ready to automate API testing? You're all set! 🎉**
