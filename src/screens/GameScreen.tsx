import React, { useEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { IconButton } from '../components/IconButton';
import { DigitSlot } from '../components/DigitSlot';
import { AttemptPip, GuessRow, PinLegend } from '../components/GameBits';
import { Keypad } from '../components/Keypad';
import { BackChevronIcon } from '../icons';
import { tokens } from '../theme/tokens';
import { MAX_ATTEMPTS, useVaultGame } from '../game/useVaultGame';
import { comboSlotSizing, guessRowSizing } from '../theme/responsiveDigits';
import { useStatsStore } from '../store/statsStore';

const { color } = tokens;

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export function GameScreen({ navigation, route }: Props) {
  const { codeLength, label } = route.params;
  const { code, entry, guesses, phase, spinning, key, del, submit } = useVaultGame(codeLength);
  const combo = comboSlotSizing(codeLength);
  const rowSizing = guessRowSizing(codeLength);

  // Background ambience is a global concern owned by Home (see HomeScreen +
  // src/audio/music.ts) — it's already playing by the time a game is
  // reachable, and just keeps going, so there's nothing to start/stop here.

  // Guards against double-recording a result if this effect ever fires twice
  // for the same game (e.g. a future React Strict Mode double-invoke).
  const recordedRef = useRef(false);

  // Once the round ends, record the result and hand off to the dedicated
  // Win/Lose screens (`replace` so the back gesture from there returns to
  // the map/home, not a finished game).
  useEffect(() => {
    if (phase === 'won') {
      if (!recordedRef.current) {
        recordedRef.current = true;
        useStatsStore.getState().recordWin(guesses.length);
      }
      navigation.replace('Win', { codeLength, label, attempts: guesses.length });
    } else if (phase === 'lost') {
      if (!recordedRef.current) {
        recordedRef.current = true;
        useStatsStore.getState().recordLoss();
      }
      navigation.replace('Lose', { codeLength, label, code, guesses });
    }
  }, [phase]);

  const canSubmit = entry.length >= codeLength && !spinning;
  const reversedGuesses = [...guesses].reverse();

  return (
    <Screen horizontalPadding={20}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <IconButton onPress={() => navigation.goBack()}>
          <BackChevronIcon />
        </IconButton>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 15, color: color.textOnDark, letterSpacing: 1.5 }}>
            {label.toUpperCase()}
          </Text>
          <Text style={{ fontFamily: tokens.type.uiSemiBold, fontSize: 11, color: color.brass, letterSpacing: 1 }}>
            {codeLength} DIGITS · 0–9
          </Text>
        </View>
        <Text style={{ fontFamily: tokens.type.uiBold, fontSize: 12, color: 'rgba(242,228,201,0.6)' }}>
          {guesses.length} / {MAX_ATTEMPTS}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 7, justifyContent: 'center', marginVertical: 13 }}>
        {Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
          <AttemptPip key={i} used={i < guesses.length} isNext={i === guesses.length} />
        ))}
      </View>

      <View
        style={{
          backgroundColor: color.vaultCream,
          borderWidth: 3.5,
          borderColor: color.ink,
          borderRadius: 26,
          paddingVertical: 20,
          paddingHorizontal: 18,
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            fontFamily: tokens.type.uiBold,
            fontSize: 11,
            color: color.brassEdge,
            letterSpacing: 3,
            marginBottom: 12,
          }}
        >
          ENTER COMBINATION
        </Text>
        <View style={{ flexDirection: 'row', gap: combo.gap, justifyContent: 'center' }}>
          {Array.from({ length: codeLength }, (_, i) => (
            <DigitSlot
              key={i}
              value={entry[i] !== undefined ? String(entry[i]) : ''}
              spinning={spinning}
              index={i}
              size={combo.size}
            />
          ))}
        </View>
      </View>

      <PinLegend />

      <ScrollView
        style={{ flex: 1, marginVertical: 12 }}
        contentContainerStyle={{ gap: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {guesses.length === 0 && (
          <Text
            style={{
              textAlign: 'center',
              fontFamily: tokens.type.uiMedium,
              fontSize: 13,
              color: 'rgba(242,228,201,0.4)',
              paddingVertical: 26,
            }}
          >
            No attempts yet. Dial a code below.
          </Text>
        )}
        {reversedGuesses.map((g, ri) => (
          <GuessRow
            key={guesses.length - ri}
            n={guesses.length - ri}
            digits={g.digits}
            animatePins={ri === 0}
            cellSize={rowSizing.cell}
            pinSize={rowSizing.pin}
            gap={rowSizing.gap}
            pins={Array.from({ length: codeLength }, (_, i) =>
              i < g.exact ? 'exact' : i < g.exact + g.mis ? 'misplaced' : 'dead',
            )}
          />
        ))}
      </ScrollView>

      <Keypad onKey={key} onDel={del} onSubmit={submit} canSubmit={canSubmit} />
    </Screen>
  );
}
