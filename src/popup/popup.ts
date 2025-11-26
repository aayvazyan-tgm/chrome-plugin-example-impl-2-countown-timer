/**
 * Spooky Countdown Timer - Popup Script
 * Displays countdown to user-configured spooky event
 */

import { calculateCountdown, formatCountdown, getStatusMessage } from '../countdown/countdown';
import { CountdownSettings, DEFAULT_SETTINGS, Theme } from '../countdown/types';
import { loadSettings } from '../storage/storage';

/** Interval ID for countdown updates */
let countdownInterval: ReturnType<typeof setInterval> | null = null;

/** DOM element references */
interface PopupElements {
  container: HTMLElement;
  eventName: HTMLElement;
  days: HTMLElement;
  hours: HTMLElement;
  minutes: HTMLElement;
  seconds: HTMLElement;
  secondsUnit: HTMLElement;
  statusText: HTMLElement;
  statusEmoji: HTMLElement;
  editButton: HTMLElement;
}

/**
 * Gets all required DOM elements
 */
function getElements(): PopupElements | null {
  const container = document.getElementById('popup-container');
  const eventName = document.getElementById('event-name');
  const days = document.getElementById('days');
  const hours = document.getElementById('hours');
  const minutes = document.getElementById('minutes');
  const seconds = document.getElementById('seconds');
  const secondsUnit = document.getElementById('seconds-unit');
  const statusText = document.getElementById('status-text');
  const statusEmoji = document.getElementById('status-emoji');
  const editButton = document.getElementById('edit-button');

  if (
    !container ||
    !eventName ||
    !days ||
    !hours ||
    !minutes ||
    !seconds ||
    !secondsUnit ||
    !statusText ||
    !statusEmoji ||
    !editButton
  ) {
    return null;
  }

  return {
    container,
    eventName,
    days,
    hours,
    minutes,
    seconds,
    secondsUnit,
    statusText,
    statusEmoji,
    editButton,
  };
}

/**
 * Applies the selected theme to the popup container
 */
export function applyTheme(container: HTMLElement, theme: Theme): void {
  // Remove all theme classes
  container.classList.remove('theme-pumpkin-orange', 'theme-ghost-white', 'theme-witch-purple');
  // Add the selected theme class
  container.classList.add(`theme-${theme}`);
}

/**
 * Updates the event name display
 */
export function updateEventName(element: HTMLElement, eventName: string): void {
  element.textContent = eventName || DEFAULT_SETTINGS.eventName;
}

/**
 * Parses target date and time strings into a Date object
 */
function parseTargetDate(targetDate: string, targetTime: string): Date | null {
  if (!targetDate) {
    return null;
  }
  const dateTimeString = `${targetDate}T${targetTime || '00:00'}`;
  const date = new Date(dateTimeString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Updates the countdown display with current values
 */
function updateCountdownDisplay(elements: PopupElements, settings: CountdownSettings): void {
  const targetDate = parseTargetDate(settings.targetDate, settings.targetTime);

  if (!targetDate) {
    // No target date configured
    elements.days.textContent = '--';
    elements.hours.textContent = '--';
    elements.minutes.textContent = '--';
    elements.seconds.textContent = '--';
    elements.statusText.textContent = 'Configure your countdown';
    elements.statusEmoji.textContent = '⚙️';
    return;
  }

  const now = new Date();
  const result = calculateCountdown(targetDate, now);
  const statusMessage = getStatusMessage(result.totalMilliseconds);

  // Update countdown digits
  elements.days.textContent = String(result.days).padStart(2, '0');
  elements.hours.textContent = String(result.hours).padStart(2, '0');
  elements.minutes.textContent = String(result.minutes).padStart(2, '0');
  elements.seconds.textContent = String(result.seconds).padStart(2, '0');

  // Update status message
  elements.statusText.textContent = statusMessage.text;
  elements.statusEmoji.textContent = statusMessage.emoji;
}

/**
 * Starts the countdown timer with 1-second updates
 */
function startCountdown(elements: PopupElements, settings: CountdownSettings): void {
  // Clear any existing interval
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  // Initial update
  updateCountdownDisplay(elements, settings);

  // Update every second
  countdownInterval = setInterval(() => {
    updateCountdownDisplay(elements, settings);
  }, 1000);
}

/**
 * Handles Edit button click - opens options page
 */
function handleEditClick(): void {
  if (chrome?.runtime?.openOptionsPage) {
    void chrome.runtime.openOptionsPage();
  }
}

/**
 * Initializes the popup
 */
async function initPopup(): Promise<void> {
  const elements = getElements();
  if (!elements) {
    console.error('Failed to find required DOM elements');
    return;
  }

  try {
    const settings = await loadSettings();

    // Apply theme
    applyTheme(elements.container, settings.theme);

    // Update event name
    updateEventName(elements.eventName, settings.eventName);

    // Handle show/hide seconds
    if (!settings.showSeconds) {
      elements.container.classList.add('hide-seconds');
    }

    // Start countdown
    startCountdown(elements, settings);

    // Set up Edit button handler
    elements.editButton.addEventListener('click', handleEditClick);
  } catch (error) {
    console.error('Failed to initialize popup:', error);
    elements.statusText.textContent = 'Error loading settings';
    elements.statusEmoji.textContent = '⚠️';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  void initPopup();
});

// Clean up interval when popup closes
window.addEventListener('unload', () => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

export { formatCountdown };
