const { pickRandom, pickWeighted } = require('./utils');

describe('pickRandom', () => {
  it('returns empty string for empty array', () => {
    expect(pickRandom([])).toBe('');
  });

  it('returns empty string for non-array (null)', () => {
    expect(pickRandom(null)).toBe('');
  });

  it('returns empty string for non-array (undefined)', () => {
    expect(pickRandom(undefined)).toBe('');
  });

  it('returns empty string for non-array (object)', () => {
    expect(pickRandom({ length: 1 })).toBe('');
  });

  it('returns the only item for single-element array', () => {
    expect(pickRandom(['only'])).toBe('only');
  });

  it('returns a string that is in the array', () => {
    const list = ['a', 'b', 'c'];
    for (let i = 0; i < 50; i++) {
      const result = pickRandom(list);
      expect(list).toContain(result);
    }
  });

  it('returns string type', () => {
    const list = ['x', 'y'];
    expect(typeof pickRandom(list)).toBe('string');
  });

  it('can return any element from list (statistical sanity)', () => {
    const list = ['first', 'second', 'third'];
    const seen = new Set();
    for (let i = 0; i < 100; i++) {
      seen.add(pickRandom(list));
    }
    expect(seen.size).toBe(list.length);
  });
});

describe('pickWeighted', () => {
  it('returns empty string for empty array', () => {
    expect(pickWeighted([], new Set())).toBe('');
  });

  it('returns empty string for non-array', () => {
    expect(pickWeighted(null, new Set())).toBe('');
    expect(pickWeighted(undefined, new Set())).toBe('');
  });

  it('returns an element from the list', () => {
    const list = ['a', 'b', 'c'];
    const seen = new Set();
    const result = pickWeighted(list, seen);
    expect(list).toContain(result);
  });

  it('adds picked item to seen set', () => {
    const list = ['a', 'b', 'c'];
    const seen = new Set();
    const result = pickWeighted(list, seen);
    expect(seen.has(result)).toBe(true);
  });

  it('works with object items (text + tags)', () => {
    const list = [{ text: 'excuse1', tags: ['physical'] }, { text: 'excuse2', tags: ['mental'] }];
    const seen = new Set();
    const result = pickWeighted(list, seen);
    expect(list).toContain(result);
    expect(seen.has(result.text)).toBe(true);
  });

  it('resets seen set when all items have been seen', () => {
    const list = ['a', 'b'];
    const seen = new Set(['a', 'b']);
    pickWeighted(list, seen);
    expect(seen.size).toBe(1);
  });

  it('favors unseen items over seen ones', () => {
    const list = ['seen1', 'seen2', 'unseen'];
    const counts = { seen1: 0, seen2: 0, unseen: 0 };
    for (let i = 0; i < 300; i++) {
      const seen = new Set(['seen1', 'seen2']);
      const result = pickWeighted(list, seen);
      counts[result]++;
    }
    expect(counts.unseen).toBeGreaterThan(counts.seen1);
    expect(counts.unseen).toBeGreaterThan(counts.seen2);
  });
});
