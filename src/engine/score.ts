/**
 * Pure scoring logic for a code-breaking guess. Zero React imports — this
 * file must stay independently testable with plain Node/Jest.
 */

export type Feedback = { exact: number; misplaced: number };

/**
 * Scores `guess` against `secret`.
 *
 * Algorithm: count exact (position-and-value) matches first and remove those
 * positions from consideration on both sides, then count remaining matches
 * by digit frequency. Counting "is this guess digit anywhere in the secret"
 * without removing exact matches and without tracking remaining frequency
 * over-counts whenever a digit repeats — e.g. secret `1122` vs guess `1213`
 * has to come out to (1 exact, 2 misplaced), not (1, 3).
 */
export function score(secret: string, guess: string): Feedback {
  if (secret.length !== guess.length) {
    throw new Error(`score(): secret and guess must be the same length (got ${secret.length} and ${guess.length})`);
  }

  let exact = 0;
  const secretRest: string[] = [];
  const guessRest: string[] = [];

  for (let i = 0; i < secret.length; i++) {
    if (secret[i] === guess[i]) {
      exact++;
    } else {
      secretRest.push(secret[i]);
      guessRest.push(guess[i]);
    }
  }

  const remainingCounts = new Map<string, number>();
  for (const digit of secretRest) {
    remainingCounts.set(digit, (remainingCounts.get(digit) ?? 0) + 1);
  }

  let misplaced = 0;
  for (const digit of guessRest) {
    const count = remainingCounts.get(digit) ?? 0;
    if (count > 0) {
      misplaced++;
      remainingCounts.set(digit, count - 1);
    }
  }

  return { exact, misplaced };
}

export type DigitFeedback = 'exact' | 'misplaced' | 'dead';

/**
 * Same matching rules as `score()`, but returns a tag *per guess digit*
 * instead of just totals — which position was right, which digit was in the
 * secret but in the wrong spot, and which wasn't in the secret at all.
 *
 * Deliberately not used during play on Medium/Hard: Mastermind's puzzle
 * depends on exact/misplaced counts alone not revealing *which* positions
 * matched. There it's for post-game review, once the secret is already
 * revealed and there's nothing left to deduce — so players can see exactly
 * where a guess went wrong.
 *
 * Easy is the one exception: `Difficulty.revealPositions` turns this same
 * per-digit breakdown on *during* play (see `PositionalGuessRow`), which is
 * precisely what makes Easy easy.
 */
export function perDigitFeedback(secret: string, guess: string): DigitFeedback[] {
  if (secret.length !== guess.length) {
    throw new Error(`perDigitFeedback(): secret and guess must be the same length (got ${secret.length} and ${guess.length})`);
  }

  const tags: DigitFeedback[] = new Array(guess.length).fill('dead');
  const remainingCounts = new Map<string, number>();

  for (let i = 0; i < secret.length; i++) {
    if (secret[i] === guess[i]) {
      tags[i] = 'exact';
    } else {
      remainingCounts.set(secret[i], (remainingCounts.get(secret[i]) ?? 0) + 1);
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (tags[i] === 'exact') continue;
    const count = remainingCounts.get(guess[i]) ?? 0;
    if (count > 0) {
      tags[i] = 'misplaced';
      remainingCounts.set(guess[i], count - 1);
    }
  }

  return tags;
}
