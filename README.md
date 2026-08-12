# Automation Exercise - Screenplay Pattern

A Playwright-based test automation framework implementing the Screenplay Pattern for the [Automation Exercise](https://www.automationexercise.com/) website.

## Project Overview

This project demonstrates the Screenplay Pattern architecture applied to UI test automation using Playwright. The framework provides a clean, readable approach to writing automated tests with reusable components: Actors, Abilities, Tasks, and Questions.

**Current Scope:** The framework currently implements authentication (login) and contact form submission automation across multiple environments.

## Technology Stack

- **Playwright** (v1.62.1) - Cross-browser automation library
- **TypeScript** - Type-safe code development
- **Node.js** - Runtime environment
- **cross-env** (v10.1.0) - Cross-platform environment variable management
- **Playwright HTML Reporter** - Built-in test reporting

## Project Structure

```
automationexercise-screenplay/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD pipeline
├── fixtures/
│   ├── actorFixture.ts           # Actor fixture for test injection
│   ├── authFixture.ts            # Authentication and storage state management
│   ├── customFixtures.ts         # Merged fixtures
│   └── dataFixture.ts            # Test data fixtures
├── src/
│   ├── abilities/
│   │   └── BrowseTheWeb.ts       # Ability to browse the web using Playwright page
│   ├── actors/
│   │   └── Actor.ts              # Core actor implementation for Screenplay pattern
│   ├── locators/
│   │   ├── LoginLocators.ts      # Selectors for login page elements
│   │   └── ContactUsLocators.ts  # Selectors for contact form elements
│   ├── questions/
│   │   ├── IsLoggedIn.ts         # Question: is user logged in?
│   │   ├── GetPageText.ts        # Question: get text from an element
│   │   └── IsSuccessMessageVisible.ts  # Question: is success message visible?
│   ├── tasks/
│   │   ├── auth/
│   │   │   └── Login.ts          # Task: perform login action
│   │   └── common/
│   │       └── ContactUs.ts      # Task: submit contact form with file upload
│   ├── interactions/              # (Not currently implemented)
│   └── models/                    # (Not currently implemented)
├── test-data/
│   ├── expected/
│   │   └── loginData.json        # Expected login test results
│   ├── input/
│   │   ├── loginData.json        # Login test input data
│   │   ├── contactUsData.json    # Contact form test data
│   │   └── files/
│   │       └── test.txt          # File for upload testing
├── tests/
│   ├── auth.setup.ts             # Setup script: authenticates and saves session
│   └── ui/
│       ├── auth/
│       │   └── login.spec.ts     # Login automation tests (TC2, TC3)
│       └── common/
│           └── contactUs.spec.ts # Contact form submission tests (TC6)
├── utils/
│   ├── envConfig.ts              # Environment-specific configuration
│   └── routes.ts                 # Application route definitions
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Project dependencies and scripts
└── tsconfig.json                 # TypeScript compiler configuration
```

## Framework Architecture

### Screenplay Pattern Implementation

The Screenplay Pattern is implemented through four main components:

#### 1. **Actor**

An `Actor` is the central abstraction that performs tasks and asks questions. It holds a reference to the Playwright `Page` and provides two main methods:

```typescript
// Perform one or more tasks
await actor.attemptsTo(task1, task2, task3);

// Ask a question and get an answer
const result = await actor.asks(question);
```

**File:** [src/actors/Actor.ts](src/actors/Actor.ts)

#### 2. **Ability**

An `Ability` represents what the actor can do. Currently, there is one ability:

- **BrowseTheWeb**: Provides access to the Playwright `Page` object through `BrowseTheWeb.as(actor)`, allowing direct interaction with the browser.

**File:** [src/abilities/BrowseTheWeb.ts](src/abilities/BrowseTheWeb.ts)

#### 3. **Tasks**

A `Task` is an action the actor performs. Tasks implement `performAs(actor)` and are chainable.

**Implemented Tasks:**

- **Login** ([src/tasks/auth/Login.ts](src/tasks/auth/Login.ts))
  - Navigates to the login page
  - Fills email and password fields
  - Clicks login button
  - Usage: `await actor.attemptsTo(Login.withCredentials(email, password))`

- **ContactUs** ([src/tasks/common/ContactUs.ts](src/tasks/common/ContactUs.ts))
  - Navigates to home page
  - Handles browser dialog auto-acceptance
  - Clicks Contact Us button
  - Fills contact form (name, email, subject, message)
  - Uploads file (`test.txt`)
  - Submits form
  - Usage: `await actor.attemptsTo(ContactUs.withDetails(name, email, subject, message))`

#### 4. **Questions**

A `Question` is what the actor asks to verify state. Questions implement `answeredBy(actor)` and return results.

**Implemented Questions:**

- **IsLoggedIn** ([src/questions/IsLoggedIn.ts](src/questions/IsLoggedIn.ts))
  - Returns: `boolean` - true if "Logged in as" element is visible

- **GetPageText** ([src/questions/GetPageText.ts](src/questions/GetPageText.ts))
  - Returns: `string` - inner text from a specified locator
  - Usage: `await actor.asks(GetPageText.of(selector))`

- **IsSuccessMessageVisible** ([src/questions/IsSuccessMessageVisible.ts](src/questions/IsSuccessMessageVisible.ts))
  - Returns: `boolean` - true if success message is visible on contact form submission

#### 5. **Locators**

Locators encapsulate CSS selectors used throughout the framework. They use `data-qa` attributes where available.

- **LoginLocators** ([src/locators/LoginLocators.ts](src/locators/LoginLocators.ts))
  - emailField, passwordField, loginButton, errorMessage, loggedInUser

- **ContactUsLocators** ([src/locators/ContactUsLocators.ts](src/locators/ContactUsLocators.ts))
  - nameField, emailField, subjectField, messageField, fileUpload, submitButton, successMessage

## How Tests Work

### Example: Login Test Flow

```typescript
// From tests/ui/auth/login.spec.ts - TC2
test("TC2 - Login User with correct email and password", async ({ actor, loginInput, loginExpected }) => {
  // 1. Perform login task
  await actor.attemptsTo(
    Login.withCredentials(loginInput.validuser.email, loginInput.validuser.password)
  );
  
  // 2. Ask questions to verify
  const loggedIn = await actor.asks(IsLoggedIn.check());
  expect(loggedIn).toBe(true);
  
  const pageText = await actor.asks(GetPageText.of(LoginLocators.loggedInUser));
  expect(pageText).toContain(loginExpected.validUser.successMessage);
});
```

**Execution Flow:**

1. `Login.withCredentials()` creates a Login task with credentials
2. `actor.attemptsTo()` executes the task:
   - Task calls `BrowseTheWeb.as(actor)` to get the Playwright page
   - Task navigates to `/login` (via `Routes.login`)
   - Task fills login form using `LoginLocators`
   - Task clicks login button
3. `IsLoggedIn.check()` creates a Question
4. `actor.asks()` executes the question:
   - Question checks if "Logged in as" locator is visible
   - Returns boolean result
5. Assertions verify the expected behavior

### Example: Contact Us Test Flow

```typescript
// From tests/ui/common/contactUs.spec.ts - TC6
test("TC6 - Contact Us Form", async ({ actor }) => {
  await actor.attemptsTo(
    ContactUs.withDetails(
      contactUsInput.name,
      contactUsInput.email,
      contactUsInput.subject,
      contactUsInput.message
    )
  );
  
  const isSuccess = await actor.asks(IsSuccessMessageVisible.check());
  expect(isSuccess).toBe(true);
});
```

**Execution Flow:**

1. `ContactUs.withDetails()` creates a ContactUs task with form data
2. `actor.attemptsTo()` executes the task:
   - Task navigates to home page
   - Task sets up dialog listener for browser confirmation
   - Task clicks Contact Us button
   - Task fills all form fields using `ContactUsLocators`
   - Task uploads `test.txt` file from `test-data/files/`
   - Task clicks submit button
3. `IsSuccessMessageVisible.check()` creates a Question
4. `actor.asks()` executes the question:
   - Question checks if success message is visible
   - Returns boolean result
5. Assertion verifies success

## Fixtures

Fixtures provide reusable setup for tests. The framework merges multiple fixtures through `customFixtures.ts`.

### Actor Fixture

**File:** [fixtures/actorFixture.ts](fixtures/actorFixture.ts)

Provides an `actor` instance with a "ExistingUser" name:

```typescript
test("example", async ({ actor }) => {
  // actor is automatically injected
});
```

### Authentication Fixture

**File:** [fixtures/authFixture.ts](fixtures/authFixture.ts)

Provides:
- `authenticatedPage` setup action - logs in and saves authentication state to `.auth/session.json`
- Used in [tests/auth.setup.ts](tests/auth.setup.ts) to create authenticated session
- Chromium browser uses this saved state via `storageState` in `playwright.config.ts`

**How it works:**
1. Setup test logs in with credentials from `test-data/input/loginData.json`
2. Saves browser storage state to `.auth/session.json`
3. Chromium project loads this state before running tests (see `playwright.config.ts`)

### Data Fixture

**File:** [fixtures/dataFixture.ts](fixtures/dataFixture.ts)

Provides test data from JSON files:
- `loginInput` - credentials from `test-data/input/loginData.json`
- `loginExpected` - expected results from `test-data/expected/loginData.json`

```typescript
test("example", async ({ loginInput, loginExpected }) => {
  // loginInput and loginExpected are injected
});
```

## Test Data

Test data is stored in JSON files under `test-data/`.

### Input Data

**[test-data/input/loginData.json](test-data/input/loginData.json)**
```json
{
  "validuser": {
    "email": "think_test_00111@gmail.com",
    "password": "Test@123"
  },
  "invalidUser": {
    "email": "wrong@test.com",
    "password": "wrongpassword"
  }
}
```

**[test-data/input/contactUsData.json](test-data/input/contactUsData.json)**
```json
{
  "name": "Test",
  "email": "Test@gmail.com",
  "subject": "test",
  "message": "this is test message"
}
```

### Expected Data

**[test-data/expected/loginData.json](test-data/expected/loginData.json)**
```json
{
  "validUser": {
    "successMessage": "Logged in as"
  },
  "invalidUser": {
    "errorMessage": "Your email or password is incorrect!"
  }
}
```

### File Upload

**[test-data/files/test.txt](test-data/files/test.txt)** - File used in Contact Us form upload test

## Configuration

### Playwright Configuration

**File:** [playwright.config.ts](playwright.config.ts)

**Key Settings:**
- **Test Directory:** `./tests`
- **Parallel Execution:** Enabled (`fullyParallel: true`)
- **Retries:** 2 retries in CI, 1 retry locally
- **Reporter:** HTML report (stored in `playwright-report/`)
- **Screenshot:** Captured on failure only
- **Base URL:** Loaded from environment-specific config

**Projects:**
- **setUp** - Runs `*.setup.ts` files to prepare authentication state
- **chromium** - Runs tests in Chromium browser, depends on setUp project, loads authentication state from `.auth/session.json`

**Note:** Firefox and Safari projects are commented out in the configuration.

### Environment Configuration

**File:** [utils/envConfig.ts](utils/envConfig.ts)

Supports three environments with different base URLs:

```typescript
ENV=qa      → https://www.automationexercise.com
ENV=staging → https://staging.automationexercise.com
ENV=prod    → https://www.automationexerciseProd.com
```

Default environment is `qa` if `ENV` is not set.

### Routes

**File:** [utils/routes.ts](utils/routes.ts)

Centralized application routes:
- `/` - Home
- `/login` - Login page
- `/signup` - Registration page
- `/view_cart` - Shopping cart
- `/products` - Products page
- `/contact_us` - Contact us page
- `/test_cases` - Test cases page

## Test Execution

### Available Commands

Tests are executed using npm scripts defined in [package.json](package.json).

#### By Environment

```bash
npm run test:qa        # Run all tests against QA environment (headed)
npm run test:staging   # Run all tests against Staging environment (headed)
npm run test:prod      # Run all tests against Production environment (headed)
```

#### By Browser

```bash
npm run test:chrome         # Run all tests in Chromium browser (headed)
npm run test:firefox        # Run all tests in Firefox browser (headed)
npm run test:safari         # Run all tests in Safari browser (headed)
npm run test:all-browsers   # Run all tests in all configured browsers (headed)
```

#### By Tag

```bash
npm run test:smoke      # Run tests tagged with @smoke (headed)
npm run test:regression # Run tests tagged with @regression (headed)
npm run test:sanity     # Run tests tagged with @sanity (headed)
```

### Test Execution Flow

1. **Setup Phase** (`auth.setup.ts`)
   - Logs in with credentials from `test-data/input/loginData.json`
   - Saves authentication state to `.auth/session.json`

2. **Test Phase** (browser project)
   - Loads saved authentication state
   - Runs individual test cases
   - Takes screenshots on failure
   - Generates HTML report

3. **Report Generation**
   - HTML report saved to `playwright-report/`
   - Open with: `npx playwright show-report`

## Implemented Tests

### Authentication Tests

**File:** [tests/ui/auth/login.spec.ts](tests/ui/auth/login.spec.ts)

- **TC2 - Login User with correct email and password** (Tags: @smoke, @regression)
  - Verifies successful login with valid credentials
  - Confirms "Logged in as" message is displayed

- **TC3 - Login User with incorrect email and password** (Tags: @sanity)
  - Verifies login fails with invalid credentials
  - Confirms error message is displayed

### Contact Us Tests

**File:** [tests/ui/common/contactUs.spec.ts](tests/ui/common/contactUs.spec.ts)

- **TC6 - Contact Us Form** (Tag: @P1)
  - Fills contact form with name, email, subject, message
  - Uploads test file
  - Submits form
  - Verifies success message is displayed

## Reporting

Playwright's built-in HTML reporter is configured to generate test reports.

**Report Location:** `playwright-report/index.html`

**Report Contents:**
- Test pass/fail status
- Execution duration
- Screenshots (captured on failure)
- Detailed step information

**View Report:**
```bash
npx playwright show-report
```

## CI/CD

### GitHub Actions

**File:** [.github/workflows/ci.yml](.github/workflows/ci.yml)

**Triggers:**
- Runs on push to `main` or `master` branches
- Runs on pull requests to `main` or `master` branches

**Workflow Steps:**
1. Checkout repository
2. Setup Node.js (LTS version)
3. Install dependencies (`npm ci`)
4. Install Playwright browsers and system dependencies
5. Run all tests (`npx playwright test`)
6. Upload HTML report as artifact (retained for 30 days)

## TypeScript Configuration

**File:** [tsconfig.json](tsconfig.json)

Basic TypeScript configuration with Node.js types enabled for development.

## Project Dependencies

All dependencies are defined in [package.json](package.json):

- **@playwright/test** (v1.62.1) - Test framework and browser automation
- **@types/node** (v26.1.2) - TypeScript types for Node.js
- **cross-env** (v10.1.0) - Cross-platform environment variable setting

---

**Note:** This framework currently focuses on UI automation for authentication and contact form submission. Folders for API automation, cart, checkout, and product functionality exist but are not yet implemented.
