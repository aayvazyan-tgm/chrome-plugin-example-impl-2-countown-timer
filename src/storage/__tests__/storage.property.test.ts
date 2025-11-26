/**
 * Property-Based Tests for Storage Utilities
 *
 * **Feature: spooky-countdown-timer, Property 5: Settings Persistence Round-Trip**
 * **Validates: Requirements 8.2, 8.4**
 */

import * as fc from 'fast-check';
import { CountdownSettings, Theme } from '../../countdown/types';

// Mock Chrome storage API before importing the module
const mockStorage: Record<string, unknown> = {};

const mockChromeStorage = {
  storage: {
    sync: {
      get: jest.fn((key: string) => {
        return Promise.resolve({ [key]: mockStorage[key] });
      }),
      set: jest.fn((items: Record<string, unknown>) => {
        Object.assign(mockStorage, items);
        return Promise.resolve();
      }),
    },
  },
};

// Set up global chrome mock before module import
(global as unknown as { chrome: typeof mockChromeStorage }).chrome = mockChromeStorage;

// Import after mock is set up
import { loadSettings, saveSettings } from '../storage';

beforeEach(() => {
  // Clear storage and mocks before each test
  Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  jest.clearAllMocks();
});

// Arbitrary for valid Theme values
const themeArb: fc.Arbitrary<Theme> = fc.constantFrom(
  'pumpkin-orange',
  'ghost-white',
  'witch-purple',
);

// Arbitrary for valid CountdownSettings
const countdownSettingsArb: fc.Arbitrary<CountdownSettings> = fc.record({
  eventName: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
  targetDate: fc.date({ min: new Date('2000-01-01'), max: new Date('2100-12-31') }).map((d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }),
  targetTime: fc
    .tuple(fc.integer({ min: 0, max: 23 }), fc.integer({ min: 0, max: 59 }))
    .map(([h, m]) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`),
  theme: themeArb,
  showSeconds: fc.boolean(),
});

describe('Storage - Property Tests', () => {
  /**
   * **Feature: spooky-countdown-timer, Property 5: Settings Persistence Round-Trip**
   * **Validates: Requirements 8.2, 8.4**
   *
   * For any valid CountdownSettings object, saving to Chrome storage and then
   * loading SHALL return an equivalent settings object.
   */
  it('should round-trip settings through save and load', async () => {
    await fc.assert(
      fc.asyncProperty(countdownSettingsArb, async (settings) => {
        // Clear storage before each iteration
        Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);

        // Save settings
        await saveSettings(settings);

        // Load settings back
        const loaded = await loadSettings();

        // Verify round-trip produces equivalent settings
        expect(loaded.eventName).toBe(settings.eventName);
        expect(loaded.targetDate).toBe(settings.targetDate);
        expect(loaded.targetTime).toBe(settings.targetTime);
        expect(loaded.theme).toBe(settings.theme);
        expect(loaded.showSeconds).toBe(settings.showSeconds);
      }),
      { numRuns: 100 },
    );
  });
});
