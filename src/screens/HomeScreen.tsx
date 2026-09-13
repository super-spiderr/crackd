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
import { DAILY_VAULT, DIFFICULTIES, DIFFICULTY_BLURB } from '../game/difficulty';

const { color } = tokens;

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [selectedId, setSelectedId] = useState<string>('medium');
  const difficulty = DIFFICULTIES.find((d) => d.id === selectedId)!;
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
          onPress={() => navigation.navigate('Game', { difficulty })}
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
          onPress={() => navigation.navigate('Game', { difficulty: DAILY_VAULT })}
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
            const active = d.id === selectedId;
            return (
              <Pressable
                key={d.id}
                style={{ flex: 1 }}
                onPress={() => {
                  playSound('tap');
                  setSelectedId(d.id);
                }}
              >
                <View
                  style={
                    active
                      ? { backgroundColor: color.brass, borderWidth: 3, borderColor: color.ink, borderRadius: 14, paddingVertical: 12, alignItems: 'center' }
                      : { backgroundColor: color.surfaceRaised, borderWidth: 3, borderColor: color.surfaceRaisedEdge, borderRadius: 14, paddingVertical: 12, alignItems: 'center' }
                  }
                >
                  <Text
                    style={{
                      fontFamily: tokens.type.uiExtraBold,
                      fontSize: 14,
                      letterSpacing: 1,
                      color: active ? color.ink : color.slateMuted,
                    }}
                  >
                    {d.label.toUpperCase()}
                  </Text>
                  <Text
                    style={{
                      fontFamily: active ? tokens.type.uiBold : tokens.type.uiSemiBold,
                      fontSize: 9.5,
                      letterSpacing: 0.5,
                      marginTop: 2,
                      textAlign: 'center',
                      color: active ? 'rgba(11,34,36,0.7)' : color.slateMuted,
                    }}
                  >
                    {DIFFICULTY_BLURB[d.id]}
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
