const { EXCUSES } = require('./excuses');

describe('EXCUSES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(EXCUSES)).toBe(true);
    expect(EXCUSES.length).toBeGreaterThan(0);
  });

  it('has at least 140 items', () => {
    expect(EXCUSES.length).toBeGreaterThanOrEqual(140);
  });

  it('every item has a non-empty text string and tags array', () => {
    EXCUSES.forEach((excuse, i) => {
      expect(typeof excuse.text).toBe('string');
      expect(excuse.text.trim().length).toBeGreaterThan(0);
      expect(Array.isArray(excuse.tags)).toBe(true);
    });
  });

  it('no duplicate excuses', () => {
    const texts = EXCUSES.map((e) => e.text);
    const set = new Set(texts);
    expect(set.size).toBe(EXCUSES.length);
  });

  it('no item is only whitespace', () => {
    EXCUSES.forEach((excuse) => {
      expect(excuse.text.trim()).toBe(excuse.text);
      expect(excuse.text).not.toBe('');
    });
  });
});
