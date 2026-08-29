import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DuelPlayer } from '../game/duelConstants';

const STORAGE_KEY = 'crackd.duelHistory.v1';
const SCHEMA_VERSION = 1;
// Bound how much pass-and-play history we keep on disk — old matches age out
// so this never grows unbounded on a device that's played hundreds of duels.
const MAX_MATCHES = 30;

export type DuelHistoryPlayer = {
  name: string;
  color: string;
  /** The code this player set — i.e. the one their opponent was trying to crack. */
  code: number[];
  /** How many guesses this player made at the opponent's code. */
  attempts: number;
};

export type DuelMatchRecord = {
  id: string;
  playedAt: number;
  /** Index into `players` of the winner, or null for a draw (both ran out of attempts). */
  winnerIndex: 0 | 1 | null;
  players: [DuelHistoryPlayer, DuelHistoryPlayer];
};

function emptyState() {
  return { schemaVersion: SCHEMA_VERSION, matches: [] as DuelMatchRecord[] };
}

async function persist(matches: DuelMatchRecord[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: SCHEMA_VERSION, matches }));
  } catch {
    // History is a nice-to-have, not gameplay-critical — a failed write shouldn't crash a round.
  }
}

type RecordMatchInput = {
  winnerIndex: 0 | 1 | null;
  p1: DuelPlayer;
  p1Attempts: number;
  p2: DuelPlayer;
  p2Attempts: number;
};

type DuelHistoryStore = {
  matches: DuelMatchRecord[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  recordMatch: (input: RecordMatchInput) => void;
  clear: () => void;
};

export const useDuelHistoryStore = create<DuelHistoryStore>((set, get) => ({
  ...emptyState(),
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { schemaVersion?: number; matches?: DuelMatchRecord[] };
        if (parsed && parsed.schemaVersion === SCHEMA_VERSION && Array.isArray(parsed.matches)) {
          set({ matches: parsed.matches, hydrated: true });
          return;
        }
      }
    } catch {
      // Corrupt or unreadable storage — fall through to a clean slate.
    }
    set({ hydrated: true });
  },

  recordMatch: ({ winnerIndex, p1, p1Attempts, p2, p2Attempts }) => {
    const record: DuelMatchRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      playedAt: Date.now(),
      winnerIndex,
      players: [
        { name: p1.name, color: p1.color, code: p1.secret, attempts: p1Attempts },
        { name: p2.name, color: p2.color, code: p2.secret, attempts: p2Attempts },
      ],
    };
    const next = [record, ...get().matches].slice(0, MAX_MATCHES);
    set({ matches: next });
    void persist(next);
  },

  clear: () => {
    set({ matches: [] });
    void persist([]);
  },
}));
