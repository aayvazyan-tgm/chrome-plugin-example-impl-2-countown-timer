/**
 * Spooky Countdown Timer - Type Definitions
 */

/** Available color themes for the countdown display */
export type Theme = 'pumpkin-orange' | 'ghost-white' | 'witch-purple';

/** User-configurable settings for the countdown timer */
export interface CountdownSettings {
  /** Name of the event being counted down to */
  eventName: string;
  /** Target date in ISO format (YYYY-MM-DD) */
  targetDate: string;
  /** Target time in 24-hour format (HH:MM) */
  targetTime: string;
  /** Visual theme for the countdown display */
  theme: Theme;
  /** Whether to display seconds in the countdown */
  showSeconds: boolean;
}

/** Result of a countdown calculation */
export interface CountdownResult {
  /** Number of full days remaining */
  days: number;
  /** Number of hours remaining (0-23) */
  hours: number;
  /** Number of minutes remaining (0-59) */
  minutes: number;
  /** Number of seconds remaining (0-59) */
  seconds: number;
  /** Total time difference in milliseconds */
  totalMilliseconds: number;
  /** Whether the target date/time has passed */
  isPast: boolean;
}

/** Status message with text and emoji */
export interface StatusMessage {
  /** The status message text */
  text: string;
  /** The emoji to display with the message */
  emoji: string;
}

/** Default settings for new installations */
export const DEFAULT_SETTINGS: CountdownSettings = {
  eventName: 'Halloween',
  targetDate: '',
  targetTime: '00:00',
  theme: 'pumpkin-orange',
  showSeconds: true,
};
