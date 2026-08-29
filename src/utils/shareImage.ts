import type { RefObject } from 'react';
import type { View } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

/**
 * Snapshots a view and hands it to the OS share sheet as a PNG — used for
 * "share my result" buttons so what gets shared looks like the app screen
 * itself rather than a plain text message.
 */
export async function shareViewAsImage(ref: RefObject<View | null>, dialogTitle = 'Share') {
  try {
    if (!ref.current) return;
    const uri = await captureRef(ref, { format: 'png', quality: 1 });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle, UTI: 'public.png' });
    }
  } catch {
    // Sharing is a nice-to-have — silently ignore a cancelled share sheet or capture failure.
  }
}
