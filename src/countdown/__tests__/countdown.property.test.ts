/**
 * Property-Based Tests for Countdown Logic
 *
 * **Feature: spooky-countdown-timer, Property 1: Countdown Calculation Consistency**
 * **Validates: Requirements 1.1**
 */

import * as fc from 'fast-check';
import { calculateCountdown } from '../countdown';

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

// Generate valid dates using timestamps to avoid NaN issues
const validDateArb = fc
  .integer({ min: new Date('2000-01-01').getTime(), max: new Date('2100-12-31').getTime() })
  .map((ts) => new Date(ts));

describe('calculateCountdown - Property Tests', () => {
  /**
   * **Feature: spooky-countdown-timer, Property 1: Countdown Calculation Consistency**
   * **Validates: Requirements 1.1**
   *
   * For any valid target date and current date, the calculateCountdown function
   * SHALL return a result where days, hours, minutes, and seconds correctly
   * decompose the total time difference, and isPast accurately reflects whether
   * the target is in the past.
   */
  it('should correctly decompose time difference into days, hours, minutes, seconds', () => {
    fc.assert(
      fc.property(validDateArb, validDateArb, (targetDate, now) => {
        const result = calculateCountdown(targetDate, now);

        // Verify isPast flag is correct
        const expectedIsPast = targetDate.getTime() < now.getTime();
        expect(result.isPast).toBe(expectedIsPast);

        // Verify totalMilliseconds is correct
        const expectedTotalMs = targetDate.getTime() - now.getTime();
        expect(result.totalMilliseconds).toBe(expectedTotalMs);

        // Verify decomposition is correct by reconstructing
        const reconstructedMs =
          result.days * MS_PER_DAY +
          result.hours * MS_PER_HOUR +
          result.minutes * MS_PER_MINUTE +
          result.seconds * MS_PER_SECOND;

        // The reconstructed value should equal the absolute total (truncated to seconds)
        const absTotal = Math.abs(result.totalMilliseconds);
        const truncatedAbsTotal = Math.floor(absTotal / MS_PER_SECOND) * MS_PER_SECOND;
        expect(reconstructedMs).toBe(truncatedAbsTotal);

        // Verify each component is within valid range
        expect(result.days).toBeGreaterThanOrEqual(0);
        expect(result.hours).toBeGreaterThanOrEqual(0);
        expect(result.hours).toBeLessThan(24);
        expect(result.minutes).toBeGreaterThanOrEqual(0);
        expect(result.minutes).toBeLessThan(60);
        expect(result.seconds).toBeGreaterThanOrEqual(0);
        expect(result.seconds).toBeLessThan(60);
      }),
      { numRuns: 100 },
    );
  });
});

import { getStatusMessage } from '../countdown';

const MS_PER_DAY_CONST = 24 * 60 * 60 * 1000;

describe('getStatusMessage - Property Tests', () => {
  /**
   * **Feature: spooky-countdown-timer, Property 2: Status Message Threshold Correctness**
   * **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
   *
   * For any time difference in milliseconds, the getStatusMessage function
   * SHALL return the correct status message based on the defined thresholds.
   */
  it('should return correct status message for any time value', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -365 * MS_PER_DAY_CONST, max: 365 * MS_PER_DAY_CONST }),
        (totalMs) => {
          const result = getStatusMessage(totalMs);
          const days = totalMs / MS_PER_DAY_CONST;

          // Verify the correct message is returned based on thresholds
          if (totalMs <= 0) {
            // Past event
            expect(result.text).toBe('The haunting has begun!');
            expect(result.emoji).toBe('🦇');
          } else if (days >= 30) {
            // 30+ days
            expect(result.text).toBe('The spirits slumber...');
            expect(result.emoji).toBe('🪦');
          } else if (days >= 7) {
            // 7-29 days
            expect(result.text).toBe('Something stirs in the shadows');
            expect(result.emoji).toBe('👻');
          } else if (days >= 1) {
            // 1-6 days
            expect(result.text).toBe('The veil grows thin!');
            expect(result.emoji).toBe('🎃');
          } else {
            // Less than 24 hours
            expect(result.text).toBe('THE WITCHING HOUR APPROACHES');
            expect(result.emoji).toBe('💀');
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

import { formatCountdown } from '../countdown';
import { CountdownResult } from '../types';

describe('formatCountdown - Property Tests', () => {
  /**
   * **Feature: spooky-countdown-timer, Property 3: Show Seconds Toggle Behavior**
   * **Validates: Requirements 1.3, 7.2, 7.3**
   *
   * For any countdown result and showSeconds setting, the formatted countdown
   * string SHALL include seconds if and only if showSeconds is true.
   */
  it('should include seconds if and only if showSeconds is true', () => {
    fc.assert(
      fc.property(
        fc.nat(365), // days
        fc.nat(23), // hours
        fc.nat(59), // minutes
        fc.nat(59), // seconds
        fc.boolean(), // showSeconds
        (days, hours, minutes, seconds, showSeconds) => {
          const result: CountdownResult = {
            days,
            hours,
            minutes,
            seconds,
            totalMilliseconds: 0, // Not used in formatting
            isPast: false,
          };

          const formatted = formatCountdown(result, showSeconds);

          // Check that seconds are included iff showSeconds is true
          const containsSeconds = formatted.includes(`${seconds}s`);
          expect(containsSeconds).toBe(showSeconds);

          // Verify days, hours, minutes are always present
          expect(formatted).toContain(`${days}d`);
          expect(formatted).toContain(`${hours}h`);
          expect(formatted).toContain(`${minutes}m`);
        },
      ),
      { numRuns: 100 },
    );
  });
});
