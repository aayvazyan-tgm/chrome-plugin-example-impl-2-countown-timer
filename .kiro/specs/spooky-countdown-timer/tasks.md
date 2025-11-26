# Implementation Plan

- [x] 1. Set up core countdown logic module






  - [x] 1.1 Create countdown types and interfaces

    - Create `src/countdown/types.ts` with CountdownSettings, CountdownResult, Theme, and StatusMessage interfaces
    - Define DEFAULT_SETTINGS constant
    - _Requirements: 1.1, 6.3, 7.4_
  - [x] 1.2 Implement calculateCountdown function


    - Create `src/countdown/countdown.ts` with pure function for time difference calculation
    - Handle past dates (negative time) with isPast flag
    - Decompose milliseconds into days, hours, minutes, seconds
    - _Requirements: 1.1_
  - [x] 1.3 Write property test for countdown calculation


    - **Property 1: Countdown Calculation Consistency**
    - **Validates: Requirements 1.1**
  - [x] 1.4 Implement getStatusMessage function


    - Add status message resolver with threshold logic
    - Return appropriate message and emoji based on time remaining
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 1.5 Write property test for status message thresholds

    - **Property 2: Status Message Threshold Correctness**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5**
  - [x] 1.6 Implement formatCountdown function


    - Create formatter that respects showSeconds setting
    - Return formatted string with days, hours, minutes, and optional seconds
    - _Requirements: 1.3, 7.2, 7.3_
  - [x] 1.7 Write property test for show seconds toggle


    - **Property 3: Show Seconds Toggle Behavior**
    - **Validates: Requirements 1.3, 7.2, 7.3**

- [x] 2. Implement storage utilities





  - [x] 2.1 Create storage helper functions


    - Create `src/storage/storage.ts` with loadSettings and saveSettings functions
    - Use chrome.storage.sync API
    - Handle missing/corrupted settings with defaults
    - _Requirements: 8.2, 8.4, 10.3_

  - [x] 2.2 Write property test for settings persistence

    - **Property 5: Settings Persistence Round-Trip**
    - **Validates: Requirements 8.2, 8.4**

- [x] 3. Checkpoint





  - Ensure all tests pass, ask the user if questions arise.

- [x] 4. Build popup UI





  - [x] 4.1 Update popup HTML structure


    - Modify `src/popup/popup.html` with countdown display elements
    - Add event name heading, countdown digits, status message area
    - Add Edit button
    - _Requirements: 1.1, 2.1, 4.1_
  - [x] 4.2 Implement popup CSS with theme support


    - Update `src/popup/popup.css` with Halloween dark theme
    - Add CSS variables for three themes (pumpkin-orange, ghost-white, witch-purple)
    - Style countdown digits, status message, and Edit button
    - _Requirements: 6.2, 6.3_
  - [x] 4.3 Implement popup TypeScript logic


    - Update `src/popup/popup.ts` to load settings and start countdown
    - Update display every second using setInterval
    - Apply theme class based on settings
    - Handle Edit button click to open options page
    - _Requirements: 1.1, 1.2, 1.4, 2.1, 2.2, 4.2_
  - [x] 4.4 Write property test for event name display


    - **Property 4: Event Name Display**
    - **Validates: Requirements 2.1**
  - [x] 4.5 Write property test for theme application


    - **Property 6: Theme Application**
    - **Validates: Requirements 6.2**
-

- [x] 5. Build options page UI




  - [x] 5.1 Update options HTML structure


    - Modify `src/options/options.html` with form inputs
    - Add event name text input, date picker, time picker
    - Add theme dropdown, show seconds checkbox
    - Add Save button and preview section
    - _Requirements: 5.1, 5.2, 5.3, 6.1, 7.1, 8.1, 9.1_
  - [x] 5.2 Implement options CSS


    - Update `src/options/options.css` with Halloween styling
    - Style form inputs, preview section, and save confirmation
    - Add theme preview styles
    - _Requirements: 9.1, 9.3_
  - [x] 5.3 Implement options TypeScript logic


    - Update `src/options/options.ts` to load and save settings
    - Populate form fields from saved settings
    - Handle Save button with confirmation message
    - Update preview section on input changes
    - Handle empty event name with default
    - _Requirements: 5.4, 8.2, 8.3, 9.2, 10.1_
  - [x] 5.4 Write property test for preview reflects settings


    - **Property 7: Preview Reflects Current Settings**
    - **Validates: Requirements 9.2, 9.3**
-

- [x] 6. Update manifest and extension metadata





  - [x] 6.1 Update manifest.json

    - Change extension name to "Spooky Countdown Timer"
    - Update description for Halloween theme
    - _Requirements: N/A (metadata)_

- [x] 7. Checkpoint





  - Ensure all tests pass, ask the user if questions arise.
-

- [x] 8. Write E2E tests




  - [x] 8.1 Write Playwright tests for popup functionality


    - Test countdown displays correctly
    - Test status message matches time threshold
    - Test Edit button opens options page
    - _Requirements: 1.1, 3.1-3.5, 4.2_

  - [ ] 8.2 Write Playwright tests for options page
    - Test form inputs are present and functional
    - Test settings persistence across reload
    - Test theme dropdown changes CSS class
    - Test save confirmation appears
    - _Requirements: 5.1-5.4, 6.1, 7.1, 8.1-8.4_
-

- [x] 9. Final Checkpoint




  - Ensure all tests pass, ask the user if questions arise.
