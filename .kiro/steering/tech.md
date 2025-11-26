# Tech Stack

## Core Technologies

- **TypeScript** (strict mode) - Primary language
- **Chrome Extension Manifest V3** - Extension API
- **Webpack 5** - Bundling with dev/prod configs

## Testing

- **Jest** - Unit tests with jsdom environment
- **Playwright** - E2E tests in real Chrome browser
- **@testing-library/jest-dom** - DOM assertions

## Code Quality

- **ESLint** - Linting with TypeScript rules
- **Prettier** - Code formatting
- **Husky** - Git hooks (pre-commit, pre-push)
- **lint-staged** - Run linters on staged files

## Common Commands

```bash
# Development
npm run dev           # Watch mode build
npm run dev:once      # Single dev build
npm start             # Build + launch Chrome with extension

# Building
npm run build         # Production build to dist/

# Testing
npm test              # Run Jest unit tests
npm run test:coverage # Tests with coverage report
npm run test:e2e      # Run Playwright E2E tests

# Code Quality
npm run lint          # Type-check + format check + ESLint
npm run lint:fix      # Auto-fix ESLint issues
npm run format        # Format with Prettier
npm run check         # Run all checks (lint + test)

# Cleanup
npm run clean         # Remove dist/, coverage/, test artifacts
```

## Code Style Rules

- Single quotes, semicolons required
- 2-space indentation, 100 char line width
- Trailing commas in multi-line
- No explicit `any` types
- Unused vars prefixed with `_` are allowed
- Import order: builtin → external → internal → parent → sibling → index
- No floating promises (must be awaited or voided)
