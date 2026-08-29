import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { GameScreen } from '../screens/GameScreen';
import { WinScreen } from '../screens/WinScreen';
import { LoseScreen } from '../screens/LoseScreen';
import { StatsScreen } from '../screens/StatsScreen';
import { DuelHistoryScreen } from '../screens/DuelHistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { DuelSetupScreen } from '../screens/DuelSetupScreen';
import { DuelGameScreen } from '../screens/DuelGameScreen';
import { tokens } from '../theme/tokens';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: tokens.color.bgDeep, card: tokens.color.bgDeep },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DuelHistory" component={DuelHistoryScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="Win" component={WinScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Lose" component={LoseScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="DuelSetup" component={DuelSetupScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="DuelGame" component={DuelGameScreen} options={{ animation: 'fade', gestureEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
