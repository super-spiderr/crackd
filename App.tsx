import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Bungee_400Regular } from '@expo-google-fonts/bungee';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
  Outfit_800ExtraBold,
} from '@expo-google-fonts/outfit';
import { RootNavigator } from './src/navigation/RootNavigator';
import { tokens } from './src/theme/tokens';
import { useStatsStore } from './src/store/statsStore';
import { useSettingsStore } from './src/store/settingsStore';
import { useDuelHistoryStore } from './src/store/duelHistoryStore';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  const [fontsLoaded] = useFonts({
    Bungee_400Regular,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
  });
  const statsHydrated = useStatsStore((s) => s.hydrated);
  const settingsHydrated = useSettingsStore((s) => s.hydrated);
  const duelHistoryHydrated = useDuelHistoryStore((s) => s.hydrated);

  useEffect(() => {
    useStatsStore.getState().hydrate();
    useSettingsStore.getState().hydrate();
    useDuelHistoryStore.getState().hydrate();
  }, []);

  const ready = fontsLoaded && statsHydrated && settingsHydrated && duelHistoryHydrated;

  const onLayout = useCallback(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: tokens.color.bgDeep }} />;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: tokens.color.bgDeep }} onLayout={onLayout}>
        <StatusBar style="light" />
        <RootNavigator />
      </View>
    </SafeAreaProvider>
  );
}
