/**
 * Spooky Countdown Timer - Options Page Script
 * Handles settings configuration and live preview
 */

import { calculateCountdown, getStatusMessage } from '../countdown/countdown';
import { CountdownSettings, DEFAULT_SETTINGS, Theme } from '../countdown/types';
import { loadSettings, saveSettings } from '../storage/storage';

/** DOM element references for the options page */
interface OptionsElements {
  container: HTMLElement;
  eventNameInput: HTMLInputElement;
  targetDateInput: HTMLInputElement;
  targetTimeInput: HTMLInputElement;
  themeSelect: HTMLSelectElement;
  showSecondsCheckbox: HTMLInputElement;
  saveButton: HTMLButtonElement;
  saveConfirmation: HTMLElement;
  previewContainer: HTMLElement;
  previewEventName: HTMLElement;
  previewDays: HTMLElement;
  previewHours: HTMLElement;
  previewMinutes: HTMLElement;
  previewSeconds: HTMLElement;
  previewSecondsUnit: HTMLElement;
  previewStatusText: HTMLElement;
  previewStatusEmoji: HTMLElement;
}

/** Interval ID for preview countdown updates */
let previewInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Gets all required DOM elements
 */
function getElements(): OptionsElements | null {
  const container = document.getElementById('options-container');
  const eventNameInput = document.getElementById('event-name') as HTMLInputElement;
  const targetDateInput = document.getElementById('target-date') as HTMLInputElement;
  const targetTimeInput = document.getElementById('target-time') as HTMLInputElement;
  const themeSelect = document.getElementById('theme-select') as HTMLSelectElement;
  const showSecondsCheckbox = document.getElementById('show-seconds') as HTMLInputElement;
  const saveButton = document.getElementById('save-button') as HTMLButtonElement;
  const saveConfirmation = document.getElementById('save-confirmation');
  const previewContainer = document.getElementById('preview-container');
  const previewEventName = document.getElementById('preview-event-name');
  const previewDays = document.getElementById('preview-days');
  const previewHours = document.getElementById('preview-hours');
  const previewMinutes = document.getElementById('preview-minutes');
  const previewSeconds = document.getElementById('preview-seconds');
  const previewSecondsUnit = document.getElementById('preview-seconds-unit');
  const previewStatusText = document.getElementById('preview-status-text');
  const previewStatusEmoji = document.getElementById('preview-status-emoji');

  if (
    !container ||
    !eventNameInput ||
    !targetDateInput ||
    !targetTimeInput ||
    !themeSelect ||
    !showSecondsCheckbox ||
    !saveButton ||
    !saveConfirmation ||
    !previewContainer ||
    !previewEventName ||
    !previewDays ||
    !previewHours ||
    !previewMinutes ||
    !previewSeconds ||
    !previewSecondsUnit ||
    !previewStatusText ||
    !previewStatusEmoji
  ) {
    return null;
  }

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

/**
 * Gets current settings from form inputs
 */
export function getSettingsFromForm(elements: OptionsElements): CountdownSettings {
  const eventName = elements.eventNameInput.value.trim() || DEFAULT_SETTINGS.eventName;
  return {
    eventName,
    targetDate: elements.targetDateInput.value,
    targetTime: elements.targetTimeInput.value || '00:00',
    theme: elements.themeSelect.value as Theme,
    showSeconds: elements.showSecondsCheckbox.checked,
  };
}

/**
 * Populates form fields with settings
 */
function populateForm(elements: OptionsElements, settings: CountdownSettings): void {
  elements.eventNameInput.value = settings.eventName;
  elements.targetDateInput.value = settings.targetDate;
  elements.targetTimeInput.value = settings.targetTime;
  elements.themeSelect.value = settings.theme;
  elements.showSecondsCheckbox.checked = settings.showSeconds;
}

/**
 * Applies theme to both main container and preview
 */
export function applyTheme(
  container: HTMLElement,
  previewContainer: HTMLElement,
  theme: Theme,
): void {
  const themeClasses = ['theme-pumpkin-orange', 'theme-ghost-white', 'theme-witch-purple'];
  themeClasses.forEach((cls) => {
    container.classList.remove(cls);
    previewContainer.classList.remove(cls);
  });
  container.classList.add(`theme-${theme}`);
  previewContainer.classList.add(`theme-${theme}`);
}

/**
 * Updates the preview section with current form settings
 */
export function updatePreview(elements: OptionsElements): void {
  const settings = getSettingsFromForm(elements);

  // Update event name
  elements.previewEventName.textContent = settings.eventName;

  // Apply theme
  applyTheme(elements.container, elements.previewContainer, settings.theme);

  // Handle show/hide seconds
  if (settings.showSeconds) {
    elements.previewContainer.classList.remove('hide-seconds');
  } else {
    elements.previewContainer.classList.add('hide-seconds');
  }

  // Update countdown preview
  if (settings.targetDate) {
    const dateTimeString = `${settings.targetDate}T${settings.targetTime || '00:00'}`;
    const targetDate = new Date(dateTimeString);

    if (!isNaN(targetDate.getTime())) {
      const now = new Date();
      const result = calculateCountdown(targetDate, now);
      const statusMessage = getStatusMessage(result.totalMilliseconds);

      elements.previewDays.textContent = String(result.days).padStart(2, '0');
      elements.previewHours.textContent = String(result.hours).padStart(2, '0');
      elements.previewMinutes.textContent = String(result.minutes).padStart(2, '0');
      elements.previewSeconds.textContent = String(result.seconds).padStart(2, '0');
      elements.previewStatusText.textContent = statusMessage.text;
      elements.previewStatusEmoji.textContent = statusMessage.emoji;
      return;
    }
  }

  // No valid date - show placeholder
  elements.previewDays.textContent = '--';
  elements.previewHours.textContent = '--';
  elements.previewMinutes.textContent = '--';
  elements.previewSeconds.textContent = '--';
  elements.previewStatusText.textContent = 'Configure your countdown';
  elements.previewStatusEmoji.textContent = '⚙️';
}

/**
 * Shows save confirmation message temporarily
 */
function showSaveConfirmation(element: HTMLElement): void {
  element.classList.remove('hidden');
  setTimeout(() => {
    element.classList.add('hidden');
  }, 3000);
}

/**
 * Handles form submission (save settings)
 */
async function handleSave(elements: OptionsElements, event: Event): Promise<void> {
  event.preventDefault();

  const settings = getSettingsFromForm(elements);

  try {
    await saveSettings(settings);
    showSaveConfirmation(elements.saveConfirmation);
  } catch (error) {
    console.error('Failed to save settings:', error);
    elements.saveConfirmation.textContent = '⚠️ Failed to save settings';
    elements.saveConfirmation.classList.remove('hidden');
  }
}

/**
 * Sets up event listeners for form inputs to update preview
 */
function setupEventListeners(elements: OptionsElements): void {
  // Update preview on any input change
  elements.eventNameInput.addEventListener('input', () => updatePreview(elements));
  elements.targetDateInput.addEventListener('change', () => updatePreview(elements));
  elements.targetTimeInput.addEventListener('change', () => updatePreview(elements));
  elements.themeSelect.addEventListener('change', () => updatePreview(elements));
  elements.showSecondsCheckbox.addEventListener('change', () => updatePreview(elements));

  // Handle form submission
  const form = document.getElementById('settings-form');
  if (form) {
    form.addEventListener('submit', (e) => void handleSave(elements, e));
  }
}

/**
 * Starts the preview countdown timer with 1-second updates
 */
function startPreviewCountdown(elements: OptionsElements): void {
  if (previewInterval) {
    clearInterval(previewInterval);
  }

  // Initial update
  updatePreview(elements);

  // Update every second
  previewInterval = setInterval(() => {
    updatePreview(elements);
  }, 1000);
}

/**
 * Initializes the options page
 */
async function initOptions(): Promise<void> {
  const elements = getElements();
  if (!elements) {
    console.error('Failed to find required DOM elements');
    return;
  }

  try {
    const settings = await loadSettings();

    // Populate form with saved settings
    populateForm(elements, settings);

    // Apply initial theme
    applyTheme(elements.container, elements.previewContainer, settings.theme);

    // Set up event listeners
    setupEventListeners(elements);

    // Start preview countdown
    startPreviewCountdown(elements);
  } catch (error) {
    console.error('Failed to initialize options page:', error);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  void initOptions();
});

// Clean up interval when page closes
window.addEventListener('unload', () => {
  if (previewInterval) {
    clearInterval(previewInterval);
  }
});
