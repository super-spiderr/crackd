import type { DuelPlayer } from '../game/duelConstants';
import type { Guess } from '../game/useVaultGame';
import type { Difficulty } from '../engine/types';

export type VaultParams = {
  difficulty: Difficulty;
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
