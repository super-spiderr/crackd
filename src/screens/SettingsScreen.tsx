import React from 'react';
import { Alert, Switch, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { IconButton } from '../components/IconButton';
import { ShadowButton } from '../components/ShadowButton';
import { BackChevronIcon } from '../icons';
import { tokens } from '../theme/tokens';
import { useSettingsStore } from '../store/settingsStore';
import { useStatsStore } from '../store/statsStore';

const { color } = tokens;

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export function SettingsScreen({ navigation }: Props) {
  const soundEnabled = useSettingsStore((s) => s.soundEnabled);
  const setSoundEnabled = useSettingsStore((s) => s.setSoundEnabled);
  const hasStats = useStatsStore((s) => s.gamesPlayed > 0);

  const confirmReset = () => {
    Alert.alert(
      'Reset progress?',
      'This clears your stats, streaks, and attempt history. This can’t be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: () => useStatsStore.getState().reset() },
      ],
    );
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <IconButton onPress={() => navigation.goBack()}>
          <BackChevronIcon />
        </IconButton>
        <Text style={{ fontFamily: tokens.type.display, fontSize: 24, color: color.textOnDark, letterSpacing: 1 }}>
          SETTINGS
        </Text>
      </View>

      <SettingsSection label="AUDIO">
        <SettingsRow
          title="Sound"
          subtitle="Keypad clicks, win/lose cues, and background music"
          right={
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: 'rgba(242,228,201,0.18)', true: color.brass }}
              thumbColor={color.vaultCream}
              ios_backgroundColor="rgba(242,228,201,0.18)"
            />
          }
        />
      </SettingsSection>

      <SettingsSection label="DATA">
        <View style={{ paddingHorizontal: 4, paddingBottom: 12 }}>
          <Text style={{ fontFamily: tokens.type.uiMedium, fontSize: 13, color: 'rgba(242,228,201,0.55)' }}>
            Wipe every recorded game, streak, and attempt distribution and start fresh.
          </Text>
        </View>
        <ShadowButton
          bg={color.coral}
          edgeColor={color.coralEdge}
          radius={16}
          edgeDepth={5}
          style={{ paddingVertical: 14, alignItems: 'center' }}
          onPress={confirmReset}
          disabled={!hasStats}
          sound={false}
        >
          <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 15, color: '#fff', letterSpacing: 1 }}>
            RESET PROGRESS
          </Text>
        </ShadowButton>
      </SettingsSection>
    </Screen>
  );
}

function SettingsSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 26 }}>
      <Text
        style={{
          fontFamily: tokens.type.uiBold,
          fontSize: 12,
          color: 'rgba(242,228,201,0.55)',
          letterSpacing: 3,
          marginBottom: 10,
          marginLeft: 4,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          backgroundColor: 'rgba(242,228,201,0.07)',
          borderWidth: 2,
          borderColor: 'rgba(242,228,201,0.16)',
          borderRadius: 18,
          padding: 16,
        }}
      >
        {children}
      </View>
    </View>
  );
}

function SettingsRow({ title, subtitle, right }: { title: string; subtitle?: string; right: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: tokens.type.uiSemiBold, fontSize: 15, color: color.textOnDark }}>{title}</Text>
        {subtitle && (
          <Text style={{ fontFamily: tokens.type.uiMedium, fontSize: 12, color: 'rgba(242,228,201,0.5)', marginTop: 2 }}>
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
}
