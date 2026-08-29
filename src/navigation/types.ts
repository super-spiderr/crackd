import type { DuelPlayer } from '../game/duelConstants';
import type { Guess } from '../game/useVaultGame';

export type VaultParams = {
  codeLength: 3 | 4 | 5 | 6;
  label: string;
};

export type RootStackParamList = {
  Home: undefined;
  DuelHistory: undefined;
  Stats: undefined;
  Settings: undefined;
  Game: VaultParams;
  Win: VaultParams & { attempts: number };
  Lose: VaultParams & { code: number[]; guesses: Guess[] };
  DuelSetup: undefined;
  DuelGame: { p1: DuelPlayer; p2: DuelPlayer };
};
