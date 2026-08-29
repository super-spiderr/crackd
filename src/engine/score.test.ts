import { perDigitFeedback, score } from './score';

describe('score', () => {
  const cases: { secret: string; guess: string; exact: number; misplaced: number; why: string }[] = [
    { secret: '3719', guess: '1234', exact: 0, misplaced: 2, why: 'baseline' },
    { secret: '3719', guess: '3179', exact: 2, misplaced: 2, why: 'single swap' },
    { secret: '3719', guess: '3719', exact: 4, misplaced: 0, why: 'win' },
    { secret: '1122', guess: '1213', exact: 1, misplaced: 2, why: 'the repeat case — most implementations fail this' },
    { secret: '1111', guess: '1234', exact: 1, misplaced: 0, why: 'repeat in secret, single in guess' },
    { secret: '1234', guess: '1111', exact: 1, misplaced: 0, why: 'reverse of above' },
    { secret: '1234', guess: '4321', exact: 0, misplaced: 4, why: 'full permutation' },
    { secret: '0000', guess: '0000', exact: 4, misplaced: 0, why: 'zeros' },
    { secret: '1122', guess: '2211', exact: 0, misplaced: 4, why: 'repeats, all displaced' },
  ];

  test.each(cases)('$secret vs $guess → $exact exact, $misplaced misplaced ($why)', ({ secret, guess, exact, misplaced }) => {
    expect(score(secret, guess)).toEqual({ exact, misplaced });
  });

  test('throws on mismatched lengths', () => {
    expect(() => score('123', '1234')).toThrow();
  });

  test('property: exact + misplaced never exceeds codeLength, over random pairs', () => {
    for (let i = 0; i < 5000; i++) {
      const length = 1 + Math.floor(Math.random() * 8); // 1..8
      const secret = randomDigitString(length);
      const guess = randomDigitString(length);
      const { exact, misplaced } = score(secret, guess);
      expect(exact + misplaced).toBeLessThanOrEqual(length);
      expect(exact).toBeGreaterThanOrEqual(0);
      expect(misplaced).toBeGreaterThanOrEqual(0);
    }
  });

  test('property: scoring a code against itself is always a full exact match', () => {
    for (let i = 0; i < 500; i++) {
      const length = 1 + Math.floor(Math.random() * 8);
      const code = randomDigitString(length);
      expect(score(code, code)).toEqual({ exact: length, misplaced: 0 });
    }
  });
});

describe('perDigitFeedback', () => {
  const cases: { secret: string; guess: string; tags: ReturnType<typeof perDigitFeedback>; why: string }[] = [
    { secret: '3719', guess: '3179', tags: ['exact', 'misplaced', 'misplaced', 'exact'], why: 'single swap' },
    { secret: '3719', guess: '3719', tags: ['exact', 'exact', 'exact', 'exact'], why: 'win' },
    { secret: '1122', guess: '1213', tags: ['exact', 'misplaced', 'misplaced', 'dead'], why: 'the repeat case' },
    { secret: '1111', guess: '1234', tags: ['exact', 'dead', 'dead', 'dead'], why: 'repeat in secret, single in guess' },
    { secret: '3719', guess: '1234', tags: ['misplaced', 'dead', 'misplaced', 'dead'], why: 'baseline' },
  ];

  test.each(cases)('$secret vs $guess → $tags ($why)', ({ secret, guess, tags }) => {
    expect(perDigitFeedback(secret, guess)).toEqual(tags);
  });

  test('throws on mismatched lengths', () => {
    expect(() => perDigitFeedback('123', '1234')).toThrow();
  });

  test('property: tag counts always match score() totals', () => {
    for (let i = 0; i < 5000; i++) {
      const length = 1 + Math.floor(Math.random() * 8);
      const secret = randomDigitString(length);
      const guess = randomDigitString(length);
      const { exact, misplaced } = score(secret, guess);
      const tags = perDigitFeedback(secret, guess);
      expect(tags.filter((t) => t === 'exact')).toHaveLength(exact);
      expect(tags.filter((t) => t === 'misplaced')).toHaveLength(misplaced);
    }
  });
});

function randomDigitString(length: number): string {
  let out = '';
  for (let i = 0; i < length; i++) out += Math.floor(Math.random() * 10);
  return out;
}
