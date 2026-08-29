import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { ShadowButton } from '../components/ShadowButton';
import { IconButton } from '../components/IconButton';
import { DialLogoIcon, DailyVaultIcon, GearIcon } from '../icons';
import { tokens } from '../theme/tokens';
import { playSound } from '../audio/sounds';
import { startBackgroundMusic } from '../audio/music';
import { useStatsStore, winRatePercent } from '../store/statsStore';

const { color } = tokens;

const DIFFICULTIES: { n: 3 | 4 | 5 | 6; short: string; label: string }[] = [
  { n: 3, short: 'BIKE', label: 'Bike Lock' },
  { n: 4, short: 'SAFE', label: 'House Safe' },
  { n: 5, short: 'BANK', label: 'Bank Vault' },
  { n: 6, short: 'MASTER', label: 'Master Vault' },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<3 | 4 | 5 | 6>(4);
  const difficulty = DIFFICULTIES.find((d) => d.n === selected)!;
  const stats = useStatsStore();

  // Home is the stack's root and never unmounts during normal navigation, so
  // this fires exactly once per app launch — starts the ambience track that
  // then just keeps playing straight through into gameplay.
  useEffect(() => {
    startBackgroundMusic();
  }, []);

  return (
    <Screen>
      <View style={{ position: 'relative', alignItems: 'center', gap: 6 }}>
        <View style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}>
          <IconButton onPress={() => navigation.navigate('Settings')}>
            <GearIcon />
          </IconButton>
        </View>
        <DialLogoIcon />
        <Text style={{ fontFamily: tokens.type.display, fontSize: 44, color: color.textOnDark, letterSpacing: 2 }}>
          CRACKD
        </Text>
        <Text
          style={{
            fontFamily: tokens.type.uiSemiBold,
            fontSize: 13,
            color: color.brass,
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          crack the code
        </Text>
      </View>

      <View style={{ marginTop: 34, gap: 16 }}>
        <ShadowButton
          bg={color.coral}
          edgeColor={color.coralEdge}
          radius={20}
          edgeDepth={6}
          style={{ paddingVertical: 20, alignItems: 'center' }}
          onPress={() => navigation.navigate('Game', { codeLength: difficulty.n, label: difficulty.label })}
        >
          <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 22, color: '#fff', letterSpacing: 1 }}>
            NEW VAULT
          </Text>
        </ShadowButton>

        <ShadowButton
          bg={color.vaultCream}
          edgeColor={color.creamEdge}
          radius={20}
          edgeDepth={6}
          style={{ paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}
          onPress={() => navigation.navigate('Game', { codeLength: 4, label: 'Daily Vault' })}
        >
          <DailyVaultIcon />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 16, color: color.ink, letterSpacing: 0.5 }}>
              DAILY VAULT
            </Text>
            <Text style={{ fontFamily: tokens.type.uiMedium, fontSize: 13, color: color.brownMuted }}>
              Quick 4-digit vault
            </Text>
          </View>
          <View
            style={{
              backgroundColor: color.brass,
              borderWidth: 3,
              borderColor: color.ink,
              borderRadius: 12,
              paddingVertical: 8,
              paddingHorizontal: 16,
            }}
          >
            <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 14, color: color.ink }}>PLAY</Text>
          </View>
        </ShadowButton>

        <ShadowButton
          bg={color.surfaceRaised}
          edgeColor={color.surfaceRaisedEdge}
          borderColor={color.surfaceRaisedEdge}
          radius={20}
          edgeDepth={5}
          style={{ paddingVertical: 15, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 14 }}
          onPress={() => navigation.navigate('DuelSetup')}
        >
          <View
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              backgroundColor: 'rgba(242,228,201,0.1)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 12, color: color.brass, letterSpacing: 0.5 }}>
              VS
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 16, color: color.textOnDark, letterSpacing: 0.5 }}>
              2-PLAYER DUEL
            </Text>
            <Text style={{ fontFamily: tokens.type.uiMedium, fontSize: 13, color: 'rgba(242,228,201,0.5)' }}>
              Pass & play — crack each other's code
            </Text>
          </View>
        </ShadowButton>
      </View>

      <View style={{ marginTop: 30 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10, marginLeft: 4 }}>
          <Text style={{ fontFamily: tokens.type.uiBold, fontSize: 12, color: 'rgba(242,228,201,0.55)', letterSpacing: 3 }}>
            DIFFICULTY
          </Text>
          <Pressable
            onPress={() => {
              playSound('tap');
              navigation.navigate('DuelHistory');
            }}
            hitSlop={8}
          >
            <Text style={{ fontFamily: tokens.type.uiBold, fontSize: 11, color: color.brass, letterSpacing: 1 }}>
              HISTORY →
            </Text>
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {DIFFICULTIES.map((d) => {
            const active = d.n === selected;
            return (
              <Pressable
                key={d.n}
                style={{ flex: 1 }}
                onPress={() => {
                  playSound('tap');
                  setSelected(d.n);
                }}
              >
                <View
                  style={
                    active
                      ? { backgroundColor: color.brass, borderWidth: 3, borderColor: color.ink, borderRadius: 14, paddingVertical: 12, alignItems: 'center' }
                      : { backgroundColor: color.surfaceRaised, borderWidth: 3, borderColor: color.surfaceRaisedEdge, borderRadius: 14, paddingVertical: 12, alignItems: 'center' }
                  }
                >
                  <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 18, color: active ? color.ink : color.slateMuted }}>
                    {d.n}
                  </Text>
                  <Text
                    style={{
                      fontFamily: active ? tokens.type.uiBold : tokens.type.uiSemiBold,
                      fontSize: 10,
                      letterSpacing: 1,
                      marginTop: 2,
                      color: active ? color.ink : color.slateMuted,
                    }}
                  >
                    {d.short}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <Pressable
        onPress={() => {
          playSound('tap');
          navigation.navigate('Stats');
        }}
      >
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <StatTile value={`${winRatePercent(stats)}%`} label="WIN RATE" color={color.exact} />
          <StatTile value={String(stats.bestStreak)} label="BEST STREAK" color={color.misplaced} />
          <StatTile value={String(stats.wins)} label="CRACKED" color={color.textOnDark} />
        </View>
      </Pressable>
    </Screen>
  );
}

function StatTile({ value, label, color: valueColor }: { value: string; label: string; color: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(242,228,201,0.08)',
        borderWidth: 2,
        borderColor: 'rgba(242,228,201,0.18)',
        borderRadius: 14,
        paddingVertical: 12,
        alignItems: 'center',
      }}
    >
      <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 20, color: valueColor }}>{value}</Text>
      <Text style={{ fontFamily: tokens.type.uiBold, fontSize: 10.5, color: 'rgba(242,228,201,0.55)', letterSpacing: 1 }}>
        {label}
      </Text>
    </View>
  );
}
