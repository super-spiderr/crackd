import { setAudioModeAsync } from 'expo-audio';

let ready: Promise<void> | null = null;

/**
 * Lets audio play even when a phone's silent/mute switch is on (the common
 * expectation for game feedback sounds and music), and mixes with whatever
 * else is playing (e.g. the user's own music) instead of stealing audio
 * focus. Shared by both one-shot SFX and the background music loop so it's
 * only ever configured once.
 */
export function ensurePlaybackMode(): Promise<void> {
  if (!ready) {
    ready = setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' }).catch(() => {});
  }
  return ready;
}
