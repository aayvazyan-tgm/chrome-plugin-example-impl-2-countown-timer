/**
 * Storage utilities for Spooky Countdown Timer
 * Handles persistence of countdown settings via Chrome Storage API
 */

import { CountdownSettings, DEFAULT_SETTINGS, Theme } from '../countdown/types';

/** Storage key for countdown settings */
const STORAGE_KEY = 'countdownSettings';

/** Valid theme values for validation */
const VALID_THEMES: Theme[] = ['pumpkin-orange', 'ghost-white', 'witch-purple'];

/**
 * Validates and sanitizes settings, falling back to defaults for invalid values
 */
function validateSettings(data: unknown): CountdownSettings {
  if (!data || typeof data !== 'object') {
    return { ...DEFAULT_SETTINGS };
  }

  const settings = data as Record<string, unknown>;

  return {
    eventName:
      typeof settings.eventName === 'string' && settings.eventName.trim()
        ? settings.eventName
        : DEFAULT_SETTINGS.eventName,
    targetDate:
      typeof settings.targetDate === 'string' ? settings.targetDate : DEFAULT_SETTINGS.targetDate,
    targetTime:
      typeof settings.targetTime === 'string' ? settings.targetTime : DEFAULT_SETTINGS.targetTime,
    theme:
      VALID_THEMES.indexOf(settings.theme as Theme) !== -1
        ? (settings.theme as Theme)
        : DEFAULT_SETTINGS.theme,
    showSeconds:
      typeof settings.showSeconds === 'boolean'
        ? settings.showSeconds
        : DEFAULT_SETTINGS.showSeconds,
  };
}

/**
 * Loads countdown settings from Chrome storage
 * Returns default settings if none exist or if storage is corrupted
 *
 * @returns Promise resolving to CountdownSettings
 * @throws Error if Chrome storage API is unavailable
 */
export async function loadSettings(): Promise<CountdownSettings> {
  if (!chrome?.storage?.sync) {
    throw new Error('Chrome storage API is unavailable');
  }

  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    return validateSettings(result[STORAGE_KEY]);
  } catch (error) {
    console.warn('Failed to load settings, using defaults:', error);
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Saves countdown settings to Chrome storage
 *
 * @param settings - The settings to persist
 * @throws Error if Chrome storage API is unavailable or save fails
 */
export async function saveSettings(settings: CountdownSettings): Promise<void> {
  if (!chrome?.storage?.sync) {
    throw new Error('Chrome storage API is unavailable');
  }

  // Validate and sanitize before saving
  const validatedSettings = validateSettings(settings);

  await chrome.storage.sync.set({ [STORAGE_KEY]: validatedSettings });
}
