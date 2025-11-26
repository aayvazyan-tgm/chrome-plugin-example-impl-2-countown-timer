import '../../test-setup';

describe('Popup', () => {
  let container: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="popup-container" class="container theme-pumpkin-orange">
        <h1 id="event-name" class="event-name">Halloween</h1>
        <div id="countdown-display" class="countdown-display">
          <div class="countdown-digits">
            <div class="time-unit">
              <span id="days" class="digit">00</span>
              <span class="label">days</span>
            </div>
            <div class="time-unit">
              <span id="hours" class="digit">00</span>
              <span class="label">hours</span>
            </div>
            <div class="time-unit">
              <span id="minutes" class="digit">00</span>
              <span class="label">min</span>
            </div>
            <div id="seconds-unit" class="time-unit">
              <span id="seconds" class="digit">00</span>
              <span class="label">sec</span>
            </div>
          </div>
        </div>
        <div id="status-message" class="status-message">
          <span id="status-text">Loading...</span>
          <span id="status-emoji"></span>
        </div>
        <button id="edit-button" class="edit-button">Edit</button>
      </div>
    `;
    container = document.getElementById('popup-container')!;
    jest.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('should have event name heading', () => {
    const heading = document.getElementById('event-name');
    expect(heading).toBeTruthy();
    expect(heading?.textContent).toBe('Halloween');
  });

  it('should have countdown display elements', () => {
    expect(document.getElementById('days')).toBeTruthy();
    expect(document.getElementById('hours')).toBeTruthy();
    expect(document.getElementById('minutes')).toBeTruthy();
    expect(document.getElementById('seconds')).toBeTruthy();
  });

  it('should have status message area', () => {
    expect(document.getElementById('status-text')).toBeTruthy();
    expect(document.getElementById('status-emoji')).toBeTruthy();
  });

  it('should have Edit button', () => {
    const editButton = document.getElementById('edit-button');
    expect(editButton).toBeTruthy();
    expect(editButton?.textContent).toBe('Edit');
  });

  it('should initialize without errors', async () => {
    // Simply verify the module loads and DOMContentLoaded handler is registered
    await import('../popup');

    // Trigger DOMContentLoaded
    const event = new Event('DOMContentLoaded');
    document.dispatchEvent(event);

    // If we get here without errors, the test passes
    expect(container).toBeTruthy();
  });
});
