import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MAX_ATTEMPTS } from '../game/useVaultGame';

const STORAGE_KEY = 'crackd.stats.v1';
const SCHEMA_VERSION = 1;

export type StatsData = {
  schemaVersion: number;
  gamesPlayed: number;
  wins: number;
  currentStreak: number; // consecutive wins ending at the most recent game
  bestStreak: number;
  /** Index i = number of wins solved on attempt i+1 (length MAX_ATTEMPTS). */
  attemptDistribution: number[];
};

function emptyStats(): StatsData {
  return {
    schemaVersion: SCHEMA_VERSION,
    gamesPlayed: 0,
    wins: 0,
    currentStreak: 0,
    bestStreak: 0,
    attemptDistribution: Array(MAX_ATTEMPTS).fill(0),
  };
}

async function persist(stats: StatsData) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Stats are a nice-to-have, not gameplay-critical — a failed write shouldn't crash a round.
  }
}

type StatsStore = StatsData & {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  recordWin: (attempts: number) => void;
  recordLoss: () => void;
  reset: () => void;
};

export const useStatsStore = create<StatsStore>((set, get) => ({
  ...emptyStats(),
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<StatsData>;
        if (parsed && parsed.schemaVersion === SCHEMA_VERSION) {
          set({ ...emptyStats(), ...parsed, hydrated: true });
          return;
        }
        // Unknown/future schema version: don't guess at a migration, just start clean
        // rather than risk rendering corrupt numbers.
      }
    } catch {
      // Corrupt or unreadable storage — fall through to a clean slate.
    }
    set({ hydrated: true });
  },

  recordWin: (attempts) => {
    const s = get();
    const dist = [...s.attemptDistribution];
    const idx = Math.min(Math.max(Math.round(attempts), 1), MAX_ATTEMPTS) - 1;
    dist[idx] = (dist[idx] ?? 0) + 1;
    const currentStreak = s.currentStreak + 1;
    const next: StatsData = {
      schemaVersion: SCHEMA_VERSION,
      gamesPlayed: s.gamesPlayed + 1,
      wins: s.wins + 1,
      currentStreak,
      bestStreak: Math.max(s.bestStreak, currentStreak),
      attemptDistribution: dist,
    };
    set(next);
    void persist(next);
  },

  recordLoss: () => {
    const s = get();
    const next: StatsData = {
      schemaVersion: SCHEMA_VERSION,
      gamesPlayed: s.gamesPlayed + 1,
      wins: s.wins,
      currentStreak: 0,
      bestStreak: s.bestStreak,
      attemptDistribution: s.attemptDistribution,
    };
    set(next);
    void persist(next);
  },

  reset: () => {
    const next = emptyStats();
    set({ ...next, hydrated: true });
    void persist(next);
  },
}));

export function winRatePercent(stats: StatsData): number {
  return stats.gamesPlayed === 0 ? 0 : Math.round((stats.wins / stats.gamesPlayed) * 100);
}
