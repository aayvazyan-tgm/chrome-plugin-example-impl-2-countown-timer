/**
 * Property-Based Tests for Popup UI
 *
 * Tests the popup's event name display and theme application functionality.
 */

import * as fc from 'fast-check';
import { applyTheme, updateEventName } from '../popup';
import { Theme, DEFAULT_SETTINGS } from '../../countdown/types';

describe('updateEventName - Property Tests', () => {
  /**
   * **Feature: spooky-countdown-timer, Property 4: Event Name Display**
   * **Validates: Requirements 2.1**
   *
   * For any non-empty event name string, the rendered popup SHALL contain
   * that exact event name in the display.
   */
  it('should display the exact event name for any non-empty string', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (eventName) => {
          // Create a mock element
          const element = document.createElement('h1');

          // Apply the event name
          updateEventName(element, eventName);

          // Verify the element contains the exact event name
          expect(element.textContent).toBe(eventName);
        },
      ),
      { numRuns: 100 },
    );
  });

  it('should use default event name for empty strings', () => {
    fc.assert(
      fc.property(fc.constant(''), (eventName) => {
        const element = document.createElement('h1');

        updateEventName(element, eventName);

        // Should fall back to default
        expect(element.textContent).toBe(DEFAULT_SETTINGS.eventName);
      }),
      { numRuns: 10 },
    );
  });
});

describe('applyTheme - Property Tests', () => {
  /**
   * **Feature: spooky-countdown-timer, Property 6: Theme Application**
   * **Validates: Requirements 6.2**
   *
   * For any valid theme selection from the set {'pumpkin-orange', 'ghost-white', 'witch-purple'},
   * the popup container SHALL have the corresponding CSS class applied.
   */
  it('should apply the correct CSS class for any valid theme', () => {
    const validThemes: Theme[] = ['pumpkin-orange', 'ghost-white', 'witch-purple'];

    fc.assert(
      fc.property(fc.constantFrom(...validThemes), (theme) => {
        // Create a mock container element
        const container = document.createElement('div');
        container.classList.add('container');

        // Apply the theme
        applyTheme(container, theme);

        // Verify the correct theme class is applied
        expect(container.classList.contains(`theme-${theme}`)).toBe(true);

        // Verify no other theme classes are present
        const otherThemes = validThemes.filter((t) => t !== theme);
        otherThemes.forEach((otherTheme) => {
          expect(container.classList.contains(`theme-${otherTheme}`)).toBe(false);
        });
      }),
      { numRuns: 100 },
    );
  });

  it('should remove previous theme class when switching themes', () => {
    const validThemes: Theme[] = ['pumpkin-orange', 'ghost-white', 'witch-purple'];

    fc.assert(
      fc.property(
        fc.constantFrom(...validThemes),
        fc.constantFrom(...validThemes),
        (firstTheme, secondTheme) => {
          const container = document.createElement('div');
          container.classList.add('container');

          // Apply first theme
          applyTheme(container, firstTheme);
          expect(container.classList.contains(`theme-${firstTheme}`)).toBe(true);

          // Apply second theme
          applyTheme(container, secondTheme);

          // Verify only the second theme class is present
          expect(container.classList.contains(`theme-${secondTheme}`)).toBe(true);

          // If themes are different, first should be removed
          if (firstTheme !== secondTheme) {
            expect(container.classList.contains(`theme-${firstTheme}`)).toBe(false);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
