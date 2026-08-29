import { randomCode, seededCode } from './codegen';

describe('randomCode', () => {
  test('produces the requested length, digits only', () => {
    for (let i = 0; i < 200; i++) {
      const code = randomCode(4, true);
      expect(code).toMatch(/^\d{4}$/);
    }
  });

  test('allowRepeats=false never repeats a digit', () => {
    for (let i = 0; i < 200; i++) {
      const code = randomCode(6, false);
      expect(code).toHaveLength(6);
      expect(new Set(code).size).toBe(6);
    }
  });

  test('allowRepeats=true can (eventually) repeat a digit', () => {
    // Statistically near-certain over enough draws; not flaky in practice
    // (odds of 200 draws of a 6-digit code all being repeat-free are ~0).
    const sawRepeat = Array.from({ length: 200 }, () => randomCode(6, true)).some(
      (code) => new Set(code).size < code.length,
    );
    expect(sawRepeat).toBe(true);
  });

  test('rejects a no-repeat request longer than 10 digits', () => {
    expect(() => randomCode(11, false)).toThrow();
  });

  test('rejects a non-positive length', () => {
    expect(() => randomCode(0, true)).toThrow();
    expect(() => randomCode(-1, true)).toThrow();
  });
});

describe('seededCode', () => {
  test('same seed always yields the same code', () => {
    const a = seededCode('2026-08-26', 4, true);
    const b = seededCode('2026-08-26', 4, true);
    expect(a).toBe(b);
  });

  test('different seeds (almost always) yield different codes', () => {
    const codes = new Set(
      Array.from({ length: 30 }, (_, i) => seededCode(`2026-08-${String(i + 1).padStart(2, '0')}`, 4, true)),
    );
    // Collisions are possible (1 in 10^4 per pair) but implausible across 30 distinct dates.
    expect(codes.size).toBeGreaterThan(20);
  });

  test('is pinned to specific outputs for the current PRNG + hash implementation', () => {
    // If this ever fails after a change to mulberry32/FNV-1a/drawDigits, every
    // live daily-challenge streak is about to see its puzzle change underneath
    // it on upgrade — treat that as a breaking change, not a test to casually update.
    expect(seededCode('2026-08-26', 4, true)).toBe('2227');
    expect(seededCode(12345, 4, true)).toBe('9348');
  });

  test('respects codeLength and allowRepeats like randomCode does', () => {
    const code = seededCode('any-seed', 6, false);
    expect(code).toHaveLength(6);
    expect(new Set(code).size).toBe(6);
  });

  test('rejects a no-repeat request longer than 10 digits', () => {
    expect(() => seededCode('x', 11, false)).toThrow();
  });
});
