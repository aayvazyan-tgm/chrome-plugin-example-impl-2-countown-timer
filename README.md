# Spooky Countdown Timer 🎃👻

A Halloween-themed Chrome extension that displays a customizable countdown to your spooky events. Built as a sample implementation of the [Chrome Extension Skeleton](https://github.com/aayvazyan-tgm/CAPS-Chromium-AI-Plugin-Skeleton).

## Features

- **Real-time Countdown** - Days, hours, minutes, and optional seconds until your event
- **Dynamic Status Messages** - Spooky messages that change based on time remaining:
  - 🪦 "The spirits slumber..." (30+ days)
  - 👻 "Something stirs in the shadows" (7-29 days)
  - 🎃 "The veil grows thin!" (1-6 days)
  - 💀 "THE WITCHING HOUR APPROACHES" (< 24 hours)
  - 🦇 "The haunting has begun!" (event passed)
- **Three Themes** - Pumpkin Orange, Ghost White, or Witch Purple
- **Customizable Events** - Set any event name and target date/time
- **Settings Sync** - Your preferences sync across devices via Chrome storage
- **Live Preview** - See your countdown appearance before saving

## Screenshots

Click the extension icon to see your countdown:

![Popup](store-assets/screenshots/screenshot-640x400.png)

## Quick Start

```bash
# Install dependencies
npm install

# Launch Chrome with extension loaded
npm start
```

## Based On

This project is built on the **[CAPS Chrome Extension Skeleton](https://github.com/aayvazyan-tgm/CAPS-Chromium-AI-Plugin-Skeleton)** - a production-ready Chrome Extension V3 starter with TypeScript, automated testing, and CI/CD.

The skeleton provides:
- TypeScript-first development with strict mode
- Jest unit tests + Playwright E2E tests
- ESLint, Prettier, and Husky for code quality
- GitHub Actions CI/CD pipeline
- Manifest V3 service worker architecture

## Project Structure

```
src/
├── popup/              # Countdown display UI
├── options/            # Settings page with preview
├── countdown/          # Core countdown logic (pure functions)
├── storage/            # Chrome storage utilities
├── background/         # Service worker
└── manifest.json
```

## Development

```bash
npm run dev          # Watch mode build
npm test             # Run unit + property tests
npm run test:e2e     # Run Playwright E2E tests
npm run check        # Type-check, lint, format, test
npm run build        # Production build
```

## Testing

The extension includes comprehensive testing:

- **Property-Based Tests** - Using fast-check to verify correctness properties
- **Unit Tests** - Jest tests for core functionality
- **E2E Tests** - Playwright tests running in real Chrome

```bash
npm test             # 21 unit/property tests
npm run test:e2e     # 12 E2E tests
```

## License

Apache License, Version 2.0 - See [LICENSE](LICENSE) for details.
