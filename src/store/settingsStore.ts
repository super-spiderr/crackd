import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'crackd.settings.v1';
const SCHEMA_VERSION = 1;

type SettingsData = {
  schemaVersion: number;
  soundEnabled: boolean;
};

function defaultSettings(): SettingsData {
  return { schemaVersion: SCHEMA_VERSION, soundEnabled: true };
}

async function persist(data: SettingsData) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Not gameplay-critical — a failed write just means the toggle doesn't survive relaunch.
  }
}

type SettingsStore = SettingsData & {
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setSoundEnabled: (next: boolean) => void;
};

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  ...defaultSettings(),
  hydrated: false,

  hydrate: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SettingsData>;
        if (parsed && parsed.schemaVersion === SCHEMA_VERSION) {
          set({ ...defaultSettings(), ...parsed, hydrated: true });
          return;
        }
      }
    } catch {
      // Corrupt or unreadable storage — fall through to defaults.
    }
    set({ hydrated: true });
  },

  setSoundEnabled: (next) => {
    const nextState = { schemaVersion: SCHEMA_VERSION, soundEnabled: next };
    set(nextState);
    void persist(nextState);
  },
}));
