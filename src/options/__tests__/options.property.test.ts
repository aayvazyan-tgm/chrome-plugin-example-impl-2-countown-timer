/**
 * Property-Based Tests for Options Page
 *
 * Tests the options page preview functionality.
 */

import * as fc from 'fast-check';
import { Theme } from '../../countdown/types';
import { applyTheme, getSettingsFromForm, updatePreview } from '../options';

/**
 * Creates mock DOM elements for options page testing
 */
function createMockOptionsElements() {
  // Create container elements
  const container = document.createElement('div');
  container.id = 'options-container';
  container.classList.add('container', 'theme-pumpkin-orange');

  // Create form inputs
  const eventNameInput = document.createElement('input') as HTMLInputElement;
  eventNameInput.id = 'event-name';
  eventNameInput.type = 'text';

  const targetDateInput = document.createElement('input') as HTMLInputElement;
  targetDateInput.id = 'target-date';
  targetDateInput.type = 'date';

  const targetTimeInput = document.createElement('input') as HTMLInputElement;
  targetTimeInput.id = 'target-time';
  targetTimeInput.type = 'time';
  targetTimeInput.value = '00:00';

  const themeSelect = document.createElement('select') as HTMLSelectElement;
  themeSelect.id = 'theme-select';
  ['pumpkin-orange', 'ghost-white', 'witch-purple'].forEach((theme) => {
    const option = document.createElement('option');
    option.value = theme;
    option.textContent = theme;
    themeSelect.appendChild(option);
  });

  const showSecondsCheckbox = document.createElement('input') as HTMLInputElement;
  showSecondsCheckbox.id = 'show-seconds';
  showSecondsCheckbox.type = 'checkbox';
  showSecondsCheckbox.checked = true;

  const saveButton = document.createElement('button') as HTMLButtonElement;
  saveButton.id = 'save-button';

  const saveConfirmation = document.createElement('div');
  saveConfirmation.id = 'save-confirmation';
  saveConfirmation.classList.add('hidden');

  // Create preview elements
  const previewContainer = document.createElement('div');
  previewContainer.id = 'preview-container';
  previewContainer.classList.add('preview-container', 'theme-pumpkin-orange');

  const previewEventName = document.createElement('h3');
  previewEventName.id = 'preview-event-name';

  const previewDays = document.createElement('span');
  previewDays.id = 'preview-days';

  const previewHours = document.createElement('span');
  previewHours.id = 'preview-hours';

  const previewMinutes = document.createElement('span');
  previewMinutes.id = 'preview-minutes';

  const previewSeconds = document.createElement('span');
  previewSeconds.id = 'preview-seconds';

  const previewSecondsUnit = document.createElement('div');
  previewSecondsUnit.id = 'preview-seconds-unit';
  previewSecondsUnit.appendChild(previewSeconds);

  const previewStatusText = document.createElement('span');
  previewStatusText.id = 'preview-status-text';

  const previewStatusEmoji = document.createElement('span');
  previewStatusEmoji.id = 'preview-status-emoji';

  return {
    container,
    eventNameInput,
    targetDateInput,
    targetTimeInput,
    themeSelect,
    showSecondsCheckbox,
    saveButton,
    saveConfirmation,
    previewContainer,
    previewEventName,
    previewDays,
    previewHours,
    previewMinutes,
    previewSeconds,
    previewSecondsUnit,
    previewStatusText,
    previewStatusEmoji,
  };
}

describe('Options Page Preview - Property Tests', () => {
  /**
   * **Feature: spooky-countdown-timer, Property 7: Preview Reflects Current Settings**
   * **Validates: Requirements 9.2, 9.3**
   *
   * For any settings configuration in the options page, the preview section SHALL
   * display a countdown that matches those settings (theme, showSeconds, event name).
   */
  describe('Preview reflects theme settings', () => {
    it('should apply the selected theme to both container and preview', () => {
      const validThemes: Theme[] = ['pumpkin-orange', 'ghost-white', 'witch-purple'];

      fc.assert(
        fc.property(fc.constantFrom(...validThemes), (theme) => {
          const elements = createMockOptionsElements();

          // Apply theme
          applyTheme(elements.container, elements.previewContainer, theme);

          // Verify both containers have the correct theme class
          expect(elements.container.classList.contains(`theme-${theme}`)).toBe(true);
          expect(elements.previewContainer.classList.contains(`theme-${theme}`)).toBe(true);

          // Verify no other theme classes are present
          const otherThemes = validThemes.filter((t) => t !== theme);
          otherThemes.forEach((otherTheme) => {
            expect(elements.container.classList.contains(`theme-${otherTheme}`)).toBe(false);
            expect(elements.previewContainer.classList.contains(`theme-${otherTheme}`)).toBe(false);
          });
        }),
        { numRuns: 100 },
      );
    });
  });

  describe('Preview reflects event name', () => {
    it('should display the event name from form input in preview', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
          (eventName) => {
            const elements = createMockOptionsElements();

            // Set event name in form
            elements.eventNameInput.value = eventName;

            // Update preview
            updatePreview(elements);

            // Verify preview shows the trimmed event name
            // (implementation correctly trims whitespace from event names)
            expect(elements.previewEventName.textContent).toBe(eventName.trim());
          },
        ),
        { numRuns: 100 },
      );
    });

    it('should use default event name when form input is empty', () => {
      fc.assert(
        fc.property(
          fc.string().filter((s) => s.trim().length === 0),
          (emptyString) => {
            const elements = createMockOptionsElements();

            // Set empty event name
            elements.eventNameInput.value = emptyString;

            // Update preview
            updatePreview(elements);

            // Should show default "Halloween"
            expect(elements.previewEventName.textContent).toBe('Halloween');
          },
        ),
        { numRuns: 20 },
      );
    });
  });

  describe('Preview reflects showSeconds setting', () => {
    it('should show/hide seconds unit based on checkbox state', () => {
      fc.assert(
        fc.property(fc.boolean(), (showSeconds) => {
          const elements = createMockOptionsElements();

          // Set checkbox state
          elements.showSecondsCheckbox.checked = showSeconds;

          // Update preview
          updatePreview(elements);

          // Verify hide-seconds class is applied correctly
          if (showSeconds) {
            expect(elements.previewContainer.classList.contains('hide-seconds')).toBe(false);
          } else {
            expect(elements.previewContainer.classList.contains('hide-seconds')).toBe(true);
          }
        }),
        { numRuns: 100 },
      );
    });
  });

  describe('getSettingsFromForm extracts correct values', () => {
    it('should extract all form values correctly', () => {
      const validThemes: Theme[] = ['pumpkin-orange', 'ghost-white', 'witch-purple'];

      fc.assert(
        fc.property(
          fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
          fc.constantFrom(...validThemes),
          fc.boolean(),
          (eventName, theme, showSeconds) => {
            const elements = createMockOptionsElements();

            // Set form values
            elements.eventNameInput.value = eventName;
            elements.themeSelect.value = theme;
            elements.showSecondsCheckbox.checked = showSeconds;

            // Get settings from form
            const settings = getSettingsFromForm(elements);

            // Verify extracted values match (event name is trimmed by implementation)
            expect(settings.eventName).toBe(eventName.trim());
            expect(settings.theme).toBe(theme);
            expect(settings.showSeconds).toBe(showSeconds);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
