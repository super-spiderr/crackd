/**
 * Secret-code generation. Zero React imports.
 *
 * `randomCode` is for casual play (non-deterministic). `seededCode` is for
 * the daily challenge: the same seed (the UTC date string) must produce the
 * same code on every device, every time — so it runs on a small deterministic
 * PRNG rather than `Math.random`.
 */

const MAX_NO_REPEAT_LENGTH = 10; // only 10 distinct digits (0-9) exist

function assertValidLength(length: number, allowRepeats: boolean) {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error(`codegen: length must be a positive integer (got ${length})`);
  }
  if (!allowRepeats && length > MAX_NO_REPEAT_LENGTH) {
    throw new Error(`codegen: cannot generate a ${length}-digit code without repeats (only ${MAX_NO_REPEAT_LENGTH} digits exist)`);
  }
}

/** mulberry32: small, fast, deterministic 32-bit PRNG. Same seed → same output stream, forever. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic string → 32-bit int (FNV-1a), so `seededCode` can take a human-readable seed like a UTC date. */
function hashStringToInt(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function drawDigits(length: number, allowRepeats: boolean, rand: () => number): string {
  if (allowRepeats) {
    let out = '';
    for (let i = 0; i < length; i++) {
      out += Math.floor(rand() * 10);
    }
    return out;
  }

  // Fisher-Yates shuffle of 0-9, then take the first `length` — guarantees no repeats.
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = digits.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits.slice(0, length).join('');
}

/** Non-deterministic code for casual play. */
export function randomCode(length: number, allowRepeats: boolean): string {
  assertValidLength(length, allowRepeats);
  return drawDigits(length, allowRepeats, Math.random);
}

/**
 * Deterministic code for the daily challenge. `seed` is typically a UTC date
 * string (e.g. `"2026-08-26"`) but any string or 32-bit integer works — the
 * same seed always yields the same code.
 */
export function seededCode(seed: string | number, length: number, allowRepeats: boolean): string {
  assertValidLength(length, allowRepeats);
  const intSeed = typeof seed === 'number' ? seed >>> 0 : hashStringToInt(seed);
  return drawDigits(length, allowRepeats, mulberry32(intSeed));
}
