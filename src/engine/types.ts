import type { Feedback } from './score';

export type { Feedback };

export type Difficulty = {
  id: string;
  label: string; // "House safe"
  codeLength: number;
  allowRepeats: boolean;
  maxAttempts: number;
  /**
   * Easy-tier rule: every correct digit in a guess shows *which* position
   * it's in, live, instead of just contributing to an exact/misplaced count.
   * Normal Mastermind rules (counts only) keep this false.
   */
  revealPositions: boolean;
};

export type Guess = {
  value: string; // "3719"
  feedback: Feedback;
  at: number; // epoch ms
};

export type GameStatus = 'playing' | 'won' | 'lost';
export type GameMode = 'casual' | 'daily';

export type GameState = {
  schemaVersion: number;
  secret: string;
  difficulty: Difficulty;
  guesses: Guess[];
  status: GameStatus;
  mode: GameMode;
  dailyKey?: string; // "2026-08-26" — UTC date
  startedAt: number;
};
