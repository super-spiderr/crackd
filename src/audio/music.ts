import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { ensurePlaybackMode } from './audioMode';
import { useSettingsStore } from '../store/settingsStore';

// "Mischief at Night" music sting (ejah, Pixabay) — supplied track, copied in from
// the user's Downloads. It's an 18s stinger, not authored as a seamless loop, so
// looping it will have an audible seam at the repeat point (unlike the old
// scripts/gen_sounds.py loop, which was phase-matched at the seam on purpose).
//
// This is now the app's one continuous ambience track: it starts as soon as
// Home mounts (the old "intro" chime) and just keeps playing — Home never
// unmounts, and Game deliberately doesn't stop it, so it carries straight
// through into gameplay instead of restarting.
const BG_SOURCE = require('../../assets/music/bg_sting.mp3');

let player: AudioPlayer | null = null;

function getPlayer(): AudioPlayer {
  if (!player) {
    player = createAudioPlayer(BG_SOURCE);
    player.loop = true;
    player.volume = 0.35; // sits under SFX/voice, audible but not competing with the keypad
  }
  return player;
}

/** Starts the app's ambience loop. No-ops when Settings > Sound is off. */
export function startBackgroundMusic() {
  if (!useSettingsStore.getState().soundEnabled) return;
  (async () => {
    try {
      await ensurePlaybackMode();
      const p = getPlayer();
      if (!p.playing) p.play();
    } catch {
      // Non-fatal — a missing/failed audio session shouldn't block gameplay.
    }
  })();
}

/** Stops the ambience loop outright (used when Settings > Sound is turned off). */
export function stopBackgroundMusic() {
  try {
    player?.pause();
  } catch {
    // Non-fatal.
  }
}

// Global mute/unmute: regardless of which screen is on top, toggling Settings
// > Sound should immediately stop the ambience, and turning it back on should
// resume it — so this lives here once rather than duplicated per screen.
useSettingsStore.subscribe((state, prev) => {
  if (state.soundEnabled === prev.soundEnabled) return;
  if (state.soundEnabled) startBackgroundMusic();
  else stopBackgroundMusic();
});
