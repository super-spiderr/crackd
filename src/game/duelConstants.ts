import { tokens } from '../theme/tokens';

// 2-player duels are fixed at 4 digits (House Safe difficulty) — no picker,
// to keep pass-and-play setup to a single flow.
export const DUEL_CODE_LENGTH = 4;

export type DuelPlayer = {
  name: string;
  color: string; // hex, one of DUEL_COLORS
  secret: number[];
};

export const DUEL_COLORS: string[] = [
  tokens.color.coral,
  tokens.color.duelBlue,
  tokens.color.exact,
  tokens.color.misplaced,
  tokens.color.duelPurple,
  tokens.color.alarm,
];
