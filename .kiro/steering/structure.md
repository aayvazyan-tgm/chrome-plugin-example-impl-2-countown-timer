# Project Structure

```
src/
├── popup/              # Extension popup UI
│   ├── popup.html      # Popup markup
│   ├── popup.ts        # Popup logic
│   ├── popup.css       # Popup styles
│   └── __tests__/      # Popup unit tests
├── options/            # Settings/options page
│   ├── options.html
│   ├── options.ts
│   └── options.css
├── background/         # Service worker (Manifest V3)
│   ├── background.ts   # Background script
│   └── __tests__/      # Background unit tests
├── manifest.json       # Chrome extension manifest
└── test-setup.ts       # Jest test setup

e2e/                    # Playwright E2E tests
├── extension.spec.ts
└── fixtures.ts

assets/icons/           # Extension icons (16, 32, 48, 128, 512px)

dist/                   # Build output (gitignored)
```

## Architecture Patterns

- **Entry Points**: Each feature (popup, options, background) is a separate webpack entry
- **Service Worker**: Background uses Manifest V3 service worker pattern (not persistent)
- **Storage**: Use `chrome.storage.sync` for user settings
- **Messaging**: Use `chrome.runtime.onMessage` for cross-context communication
- **Tests**: Co-located in `__tests__/` folders next to source files

## Adding New Features

1. **Content Scripts**: Create `src/content/` and register in `manifest.json`
2. **New Pages**: Add entry in `webpack.common.js` and copy HTML/CSS via CopyWebpackPlugin
3. **Permissions**: Add to `manifest.json` permissions array as needed
