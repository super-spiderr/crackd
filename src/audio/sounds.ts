import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { ensurePlaybackMode } from './audioMode';
import { useSettingsStore } from '../store/settingsStore';

// Synthesized locally in scripts/gen_sounds.py — see that file to retune pitch/duration.
// (There's no "intro" entry — the intro sting was retired in favor of starting
// the background ambience track itself as soon as Home mounts; see src/audio/music.ts.)
const SOURCES = {
  tap: require('../../assets/sfx/tap.wav'),
  key: require('../../assets/sfx/key.wav'),
  delete: require('../../assets/sfx/delete.wav'),
  submit: require('../../assets/sfx/submit.wav'),
  win: require('../../assets/sfx/win.wav'),
  lose: require('../../assets/sfx/lose.wav'),
} as const;

export type SoundName = keyof typeof SOURCES;

const players = new Map<SoundName, AudioPlayer>();

function getPlayer(name: SoundName): AudioPlayer {
  let player = players.get(name);
  if (!player) {
    player = createAudioPlayer(SOURCES[name]);
    players.set(name, player);
  }
  return player;
}

/** Fire-and-forget playback of one SFX; safe to call rapidly (e.g. fast key taps). No-ops when Settings > Sound is off. */
export function playSound(name: SoundName) {
  if (!useSettingsStore.getState().soundEnabled) return;
  (async () => {
    try {
      await ensurePlaybackMode();
      const player = getPlayer(name);
      await player.seekTo(0); // rewind so a re-trigger before the clip finishes still starts clean
      player.play();
    } catch {
      // Audio isn't fatal to gameplay — swallow platform hiccups (e.g. rapid unmount).
    }
  })();
}
