# Flag Quiz Test Suite

This directory contains comprehensive tests for the Flag Quiz application. The tests are structured to ensure the application remains stable as new features are added or existing ones are modified.

## Test Structure

Tests are organized mirroring the main application structure:

```
tests/
├── README.md
├── setup.ts
├── components/
│   ├── FlagQuiz.test.tsx
│   ├── FlagOption.test.tsx
│   └── ...
└── utils/
    ├── quizUtils.test.ts
    ├── scoreUtils.test.ts
    └── speechUtils.test.ts
```

## Types of Tests

1. **Unit Tests**
   - Test individual utility functions and smaller components in isolation
   - Found in `utils/` directory and some component tests

2. **Component Tests**
   - Test individual React components
   - Verify proper rendering, state changes, and user interactions
   - Use React Testing Library for DOM manipulation

## Running Tests

- Run all tests: `npm test`
- Run tests in watch mode: `npm run test:watch`
- Generate coverage report: `npm run test:coverage`

## Test Guidelines

When adding new features, make sure to:

1. Add at least one test for each new function/component
2. Include tests for:
   - Expected use case
   - Edge cases
   - Error handling

## Mocks

Several things are mocked for testing:
- Web Speech API
- Image loading
- Random number generation (for consistent testing)

## Troubleshooting

If tests are failing, check:
1. If the component interface has changed
2. If utility function behavior has changed
3. That all mocks are correctly configured 