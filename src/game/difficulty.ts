import type { Difficulty } from '../engine/types';

/**
 * The three single-player difficulty tiers, replacing the old "pick a vault
 * size" picker. Easy trades puzzle difficulty for information: every correct
 * digit reveals its own position live (see `Difficulty.revealPositions` and
 * `PositionalGuessRow`). Medium is the classic Mastermind rules the app
 * shipped with. Hard keeps those classic rules but makes the puzzle itself
 * harder — no repeated digits, a longer code, one fewer attempt.
 */
export const DIFFICULTIES: Difficulty[] = [
  {
    id: 'easy',
    label: 'Easy',
    codeLength: 4,
    allowRepeats: true,
    maxAttempts: 10,
    revealPositions: true,
  },
  {
    id: 'medium',
    label: 'Medium',
    codeLength: 4,
    allowRepeats: true,
    maxAttempts: 10,
    revealPositions: false,
  },
  {
    id: 'hard',
    label: 'Hard',
    codeLength: 5,
    allowRepeats: false,
    maxAttempts: 8,
    revealPositions: false,
  },
];

/** One line of subtext for each tier's tile on Home. */
export const DIFFICULTY_BLURB: Record<string, string> = {
  easy: 'Positions revealed',
  medium: 'Classic Mastermind',
  hard: 'No repeats · 8 tries',
};

/**
 * The Home screen's "Daily Vault" quick-play button — Medium's rules under a
 * distinct label. (True daily-seeded codes aren't wired up yet; see
 * `engine/codegen.ts#seededCode`.)
 */
export const DAILY_VAULT: Difficulty = {
  ...DIFFICULTIES[1],
  id: 'daily',
  label: 'Daily Vault',
};
