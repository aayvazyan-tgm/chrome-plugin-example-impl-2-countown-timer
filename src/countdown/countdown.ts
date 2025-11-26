/**
 * Spooky Countdown Timer - Core Countdown Logic
 */

import { CountdownResult, StatusMessage } from './types';

/** Milliseconds in one second */
const MS_PER_SECOND = 1000;
/** Milliseconds in one minute */
const MS_PER_MINUTE = MS_PER_SECOND * 60;
/** Milliseconds in one hour */
const MS_PER_HOUR = MS_PER_MINUTE * 60;
/** Milliseconds in one day */
const MS_PER_DAY = MS_PER_HOUR * 24;

/**
 * Calculates the countdown from the current time to a target date.
 * Returns a decomposed result with days, hours, minutes, seconds.
 *
 * @param targetDate - The target date/time to count down to
 * @param now - The current date/time
 * @returns CountdownResult with decomposed time units and isPast flag
 */
export function calculateCountdown(targetDate: Date, now: Date): CountdownResult {
  const totalMilliseconds = targetDate.getTime() - now.getTime();
  const isPast = totalMilliseconds < 0;

  // Use absolute value for decomposition
  const absMs = Math.abs(totalMilliseconds);

  const days = Math.floor(absMs / MS_PER_DAY);
  const hours = Math.floor((absMs % MS_PER_DAY) / MS_PER_HOUR);
  const minutes = Math.floor((absMs % MS_PER_HOUR) / MS_PER_MINUTE);
  const seconds = Math.floor((absMs % MS_PER_MINUTE) / MS_PER_SECOND);

  return {
    days,
    hours,
    minutes,
    seconds,
    totalMilliseconds,
    isPast,
  };
}

/**
 * Returns the appropriate status message based on time remaining.
 * Thresholds:
 * - >= 30 days: "The spirits slumber... 🪦"
 * - 7-29 days: "Something stirs in the shadows 👻"
 * - 1-6 days: "The veil grows thin! 🎃"
 * - < 24 hours (but not past): "THE WITCHING HOUR APPROACHES 💀"
 * - Past (< 0): "The haunting has begun! 🦇"
 *
 * @param totalMilliseconds - Total time difference in milliseconds (negative if past)
 * @returns StatusMessage with text and emoji
 */
export function getStatusMessage(totalMilliseconds: number): StatusMessage {
  // Past event
  if (totalMilliseconds <= 0) {
    return { text: 'The haunting has begun!', emoji: '🦇' };
  }

  const days = totalMilliseconds / MS_PER_DAY;

  // 30+ days
  if (days >= 30) {
    return { text: 'The spirits slumber...', emoji: '🪦' };
  }

  // 7-29 days
  if (days >= 7) {
    return { text: 'Something stirs in the shadows', emoji: '👻' };
  }

  // 1-6 days
  if (days >= 1) {
    return { text: 'The veil grows thin!', emoji: '🎃' };
  }

  // Less than 24 hours
  return { text: 'THE WITCHING HOUR APPROACHES', emoji: '💀' };
}

/**
 * Formats a countdown result into a human-readable string.
 * Respects the showSeconds setting to include or exclude seconds.
 *
 * @param result - The countdown result to format
 * @param showSeconds - Whether to include seconds in the output
 * @returns Formatted countdown string (e.g., "5d 12h 30m 45s" or "5d 12h 30m")
 */
export function formatCountdown(result: CountdownResult, showSeconds: boolean): string {
  const parts: string[] = [];

  parts.push(`${result.days}d`);
  parts.push(`${result.hours}h`);
  parts.push(`${result.minutes}m`);

  if (showSeconds) {
    parts.push(`${result.seconds}s`);
  }

  return parts.join(' ');
}
