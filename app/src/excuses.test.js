const { EXCUSES, CATEGORIES } = require('./excuses');

const VALID_TAGS = CATEGORIES.filter((c) => c.key !== 'all').map((c) => c.key);

describe('CATEGORIES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(CATEGORIES)).toBe(true);
    expect(CATEGORIES.length).toBeGreaterThan(0);
  });

  it('each category has key and label strings', () => {
    CATEGORIES.forEach((c) => {
      expect(typeof c.key).toBe('string');
      expect(c.key.length).toBeGreaterThan(0);
      expect(typeof c.label).toBe('string');
      expect(c.label.length).toBeGreaterThan(0);
    });
  });

  it('has unique keys', () => {
    const keys = CATEGORIES.map((c) => c.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('includes "all" category', () => {
    expect(CATEGORIES.find((c) => c.key === 'all')).toBeTruthy();
  });
});

describe('EXCUSES', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(EXCUSES)).toBe(true);
    expect(EXCUSES.length).toBeGreaterThan(0);
  });

  it('has at least 140 items', () => {
    expect(EXCUSES.length).toBeGreaterThanOrEqual(140);
  });

  it('every item has a non-empty text string and tags array', () => {
    EXCUSES.forEach((excuse) => {
      expect(typeof excuse.text).toBe('string');
      expect(excuse.text.trim().length).toBeGreaterThan(0);
      expect(Array.isArray(excuse.tags)).toBe(true);
      expect(excuse.tags.length).toBeGreaterThan(0);
    });
  });

  it('all tags reference valid category keys', () => {
    EXCUSES.forEach((excuse) => {
      excuse.tags.forEach((tag) => {
        expect(VALID_TAGS).toContain(tag);
      });
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

  it('every category (except all) has at least one excuse', () => {
    VALID_TAGS.forEach((tag) => {
      const count = EXCUSES.filter((e) => e.tags.includes(tag)).length;
      expect(count).toBeGreaterThan(0);
    });
  });
});
