# GarnetSky Tests

This directory contains unit tests for the GarnetSky application.

## Structure

```
tests/
├── ui/                    # Frontend React component tests
│   ├── NavBar.test.jsx    # NavBar component tests
│   └── setup.js           # Vitest setup file
├── backend/               # Backend API/validation tests
│   └── validation.test.js # Zod schema validation tests
├── vitest.config.js       # Vitest configuration for UI tests
├── jest.config.js         # Jest configuration for backend tests
└── package.json           # Test dependencies and scripts
```

## Setup

From the `tests/` directory:

```bash
npm install
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run UI Tests Only
```bash
npm run test:ui
```

### Run UI Tests in Watch Mode
```bash
npm run test:ui:watch
```

### Run Backend Tests Only
```bash
npm run test:backend
```

## Test Coverage

### UI Tests (Vitest + React Testing Library)
- **NavBar.test.jsx**: Tests navigation bar rendering, link structure, and authentication state display

### Backend Tests (Jest)
- **validation.test.js**: Tests Zod validation schemas for signup, login, and recipe creation

## Adding New Tests

- Place UI component tests in `tests/ui/` with `.test.jsx` extension
- Place backend tests in `tests/backend/` with `.test.js` extension
