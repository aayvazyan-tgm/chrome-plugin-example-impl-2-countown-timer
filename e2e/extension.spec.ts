import { test, expect } from './fixtures';

test.describe('Spooky Countdown Timer - Popup E2E Tests', () => {
  test('should display countdown elements correctly', async ({ context, extensionId }) => {
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/popup.html`);
    await popup.waitForLoadState('networkidle');

    // Verify countdown display elements are present
    await expect(popup.locator('#event-name')).toBeVisible();
    await expect(popup.locator('#days')).toBeVisible();
    await expect(popup.locator('#hours')).toBeVisible();
    await expect(popup.locator('#minutes')).toBeVisible();
    await expect(popup.locator('#seconds')).toBeVisible();

    // Verify status message area is present
    await expect(popup.locator('#status-text')).toBeVisible();
    await expect(popup.locator('#status-emoji')).toBeVisible();

    // Verify Edit button is present
    await expect(popup.locator('#edit-button')).toBeVisible();
    await expect(popup.locator('#edit-button')).toHaveText('Edit');
  });

  test('should display default event name when not configured', async ({
    context,
    extensionId,
  }) => {
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/popup.html`);
    await popup.waitForLoadState('networkidle');

    // Default event name should be "Halloween"
    const eventName = popup.locator('#event-name');
    await expect(eventName).toHaveText('Halloween');
  });

  test('should show configure message when no target date is set', async ({
    context,
    extensionId,
  }) => {
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/popup.html`);
    await popup.waitForLoadState('networkidle');

    // Without a configured date, should show placeholder values
    const statusText = popup.locator('#status-text');
    await expect(statusText).toHaveText('Configure your countdown');
  });

  test('should apply default pumpkin-orange theme', async ({ context, extensionId }) => {
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/popup.html`);
    await popup.waitForLoadState('networkidle');

    // Default theme should be pumpkin-orange
    const container = popup.locator('#popup-container');
    await expect(container).toHaveClass(/theme-pumpkin-orange/);
  });

  test('Edit button should open options page', async ({ context, extensionId }) => {
    const popup = await context.newPage();
    await popup.goto(`chrome-extension://${extensionId}/popup/popup.html`);
    await popup.waitForLoadState('networkidle');

    // Click Edit button and wait for new page
    const [optionsPage] = await Promise.all([
      context.waitForEvent('page'),
      popup.locator('#edit-button').click(),
    ]);

    // Verify options page opened
    await optionsPage.waitForLoadState('networkidle');
    expect(optionsPage.url()).toContain('options/options.html');
  });
});

test.describe('Spooky Countdown Timer - Options Page E2E Tests', () => {
  test('should display all form inputs', async ({ context, extensionId }) => {
    const optionsPage = await context.newPage();
    await optionsPage.goto(`chrome-extension://${extensionId}/options/options.html`);
    await optionsPage.waitForLoadState('networkidle');

    // Verify event name input
    await expect(optionsPage.locator('#event-name')).toBeVisible();

    // Verify date and time pickers
    await expect(optionsPage.locator('#target-date')).toBeVisible();
    await expect(optionsPage.locator('#target-time')).toBeVisible();

    // Verify theme dropdown
    await expect(optionsPage.locator('#theme-select')).toBeVisible();

    // Verify show seconds checkbox
    await expect(optionsPage.locator('#show-seconds')).toBeVisible();

    // Verify save button
    await expect(optionsPage.locator('#save-button')).toBeVisible();
    await expect(optionsPage.locator('#save-button')).toHaveText('Save Settings');
  });

  test('should have correct theme options in dropdown', async ({ context, extensionId }) => {
    const optionsPage = await context.newPage();
    await optionsPage.goto(`chrome-extension://${extensionId}/options/options.html`);
    await optionsPage.waitForLoadState('networkidle');

    const themeSelect = optionsPage.locator('#theme-select');

    // Verify all three theme options exist
    await expect(themeSelect.locator('option[value="pumpkin-orange"]')).toHaveCount(1);
    await expect(themeSelect.locator('option[value="ghost-white"]')).toHaveCount(1);
    await expect(themeSelect.locator('option[value="witch-purple"]')).toHaveCount(1);
  });

  test('should change preview theme when theme dropdown changes', async ({
    context,
    extensionId,
  }) => {
    const optionsPage = await context.newPage();
    await optionsPage.goto(`chrome-extension://${extensionId}/options/options.html`);
    await optionsPage.waitForLoadState('networkidle');

    const previewContainer = optionsPage.locator('#preview-container');

    // Default should be pumpkin-orange
    await expect(previewContainer).toHaveClass(/theme-pumpkin-orange/);

    // Change to ghost-white
    await optionsPage.locator('#theme-select').selectOption('ghost-white');
    await expect(previewContainer).toHaveClass(/theme-ghost-white/);

    // Change to witch-purple
    await optionsPage.locator('#theme-select').selectOption('witch-purple');
    await expect(previewContainer).toHaveClass(/theme-witch-purple/);
  });

  test('should show save confirmation when settings are saved', async ({
    context,
    extensionId,
  }) => {
    const optionsPage = await context.newPage();
    await optionsPage.goto(`chrome-extension://${extensionId}/options/options.html`);
    await optionsPage.waitForLoadState('networkidle');

    // Confirmation should be hidden initially
    const saveConfirmation = optionsPage.locator('#save-confirmation');
    await expect(saveConfirmation).toHaveClass(/hidden/);

    // Click save button
    await optionsPage.locator('#save-button').click();

    // Confirmation should be visible
    await expect(saveConfirmation).not.toHaveClass(/hidden/);
    await expect(saveConfirmation).toContainText('Settings saved');
  });

  test('should persist settings across page reload', async ({ context, extensionId }) => {
    const optionsPage = await context.newPage();
    await optionsPage.goto(`chrome-extension://${extensionId}/options/options.html`);
    await optionsPage.waitForLoadState('networkidle');

    // Set custom values
    await optionsPage.locator('#event-name').fill('Spooky Party');
    await optionsPage.locator('#target-date').fill('2025-10-31');
    await optionsPage.locator('#target-time').fill('20:00');
    await optionsPage.locator('#theme-select').selectOption('witch-purple');
    await optionsPage.locator('#show-seconds').uncheck();

    // Save settings
    await optionsPage.locator('#save-button').click();

    // Wait for save confirmation
    await expect(optionsPage.locator('#save-confirmation')).not.toHaveClass(/hidden/);

    // Reload page
    await optionsPage.reload();
    await optionsPage.waitForLoadState('networkidle');

    // Verify settings persisted
    await expect(optionsPage.locator('#event-name')).toHaveValue('Spooky Party');
    await expect(optionsPage.locator('#target-date')).toHaveValue('2025-10-31');
    await expect(optionsPage.locator('#target-time')).toHaveValue('20:00');
    await expect(optionsPage.locator('#theme-select')).toHaveValue('witch-purple');
    await expect(optionsPage.locator('#show-seconds')).not.toBeChecked();
  });

  test('should update preview event name when input changes', async ({ context, extensionId }) => {
    const optionsPage = await context.newPage();
    await optionsPage.goto(`chrome-extension://${extensionId}/options/options.html`);
    await optionsPage.waitForLoadState('networkidle');

    // Type a custom event name
    await optionsPage.locator('#event-name').fill('My Spooky Event');

    // Preview should update
    await expect(optionsPage.locator('#preview-event-name')).toHaveText('My Spooky Event');
  });

  test('should display preview section', async ({ context, extensionId }) => {
    const optionsPage = await context.newPage();
    await optionsPage.goto(`chrome-extension://${extensionId}/options/options.html`);
    await optionsPage.waitForLoadState('networkidle');

    // Verify preview elements are present
    await expect(optionsPage.locator('#preview-container')).toBeVisible();
    await expect(optionsPage.locator('#preview-event-name')).toBeVisible();
    await expect(optionsPage.locator('#preview-days')).toBeVisible();
    await expect(optionsPage.locator('#preview-hours')).toBeVisible();
    await expect(optionsPage.locator('#preview-minutes')).toBeVisible();
    await expect(optionsPage.locator('#preview-seconds')).toBeVisible();
    await expect(optionsPage.locator('#preview-status-text')).toBeVisible();
    await expect(optionsPage.locator('#preview-status-emoji')).toBeVisible();
  });
});
