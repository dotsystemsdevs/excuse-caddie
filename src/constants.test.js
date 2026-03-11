const { CONFIG, LOADING_MESSAGES, FONT, PALETTE } = require('./constants');

describe('CONFIG', () => {
  it('has required keys', () => {
    expect(CONFIG).toHaveProperty('REVIEW_PROMPT_EVERY_N');
    expect(CONFIG).toHaveProperty('STORAGE_KEY_ASKED_REVIEW');
    expect(CONFIG).toHaveProperty('LEGAL_BASE_URL');
    expect(CONFIG).toHaveProperty('GENERATE_DELAY_MS');
    expect(CONFIG).toHaveProperty('COPY_RESET_MS');
    expect(CONFIG).toHaveProperty('SPLASH_MIN_MS');
  });

  it('REVIEW_PROMPT_EVERY_N is a positive number', () => {
    expect(typeof CONFIG.REVIEW_PROMPT_EVERY_N).toBe('number');
    expect(CONFIG.REVIEW_PROMPT_EVERY_N).toBeGreaterThan(0);
  });

  it('STORAGE_KEY_ASKED_REVIEW is non-empty string', () => {
    expect(typeof CONFIG.STORAGE_KEY_ASKED_REVIEW).toBe('string');
    expect(CONFIG.STORAGE_KEY_ASKED_REVIEW.length).toBeGreaterThan(0);
  });

  it('LEGAL_BASE_URL is https URL', () => {
    expect(CONFIG.LEGAL_BASE_URL).toMatch(/^https:\/\//);
  });

  it('GENERATE_DELAY_MS and COPY_RESET_MS and SPLASH_MIN_MS are positive numbers', () => {
    expect(CONFIG.GENERATE_DELAY_MS).toBeGreaterThan(0);
    expect(CONFIG.COPY_RESET_MS).toBeGreaterThan(0);
    expect(CONFIG.SPLASH_MIN_MS).toBeGreaterThan(0);
  });
});

describe('LOADING_MESSAGES', () => {
  it('is non-empty array of strings', () => {
    expect(Array.isArray(LOADING_MESSAGES)).toBe(true);
    expect(LOADING_MESSAGES.length).toBeGreaterThan(0);
    LOADING_MESSAGES.forEach((msg) => {
      expect(typeof msg).toBe('string');
      expect(msg.length).toBeGreaterThan(0);
    });
  });
});

describe('FONT', () => {
  it('has expected keys and positive number values', () => {
    const keys = ['xs', 'sm', 'caption', 'label', 'body', 'bodyLg', 'title', 'hero'];
    keys.forEach((k) => {
      expect(FONT).toHaveProperty(k);
      expect(FONT[k]).toBeGreaterThan(0);
    });
  });
});

describe('PALETTE', () => {
  it('has expected keys', () => {
    const keys = ['homeBg', 'greenPale', 'accent', 'greenDark', 'cardTop', 'cardMid', 'cardBot', 'activeGreen'];
    keys.forEach((k) => {
      expect(PALETTE).toHaveProperty(k);
      expect(typeof PALETTE[k]).toBe('string');
    });
  });
});
