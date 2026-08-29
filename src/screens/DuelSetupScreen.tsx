import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { IconButton } from '../components/IconButton';
import { PassDeviceCard } from '../components/PassDeviceCard';
import { NameEntryModal } from '../components/NameEntryModal';
import { DigitSlot } from '../components/DigitSlot';
import { Keypad } from '../components/Keypad';
import { BackChevronIcon } from '../icons';
import { tokens } from '../theme/tokens';
import { DUEL_CODE_LENGTH, DUEL_COLORS, type DuelPlayer } from '../game/duelConstants';

const { color } = tokens;

type Stage = 'pass_p1' | 'enter_p1' | 'pass_p2' | 'enter_p2';

type Props = NativeStackScreenProps<RootStackParamList, 'DuelSetup'>;

export function DuelSetupScreen({ navigation }: Props) {
  const [stage, setStage] = useState<Stage>('pass_p1');
  const [entry, setEntry] = useState<number[]>([]);
  const [p1, setP1] = useState<DuelPlayer | null>(null);

  const [name, setName] = useState('');
  const [swatch, setSwatch] = useState(DUEL_COLORS[0]);
  const [nameModalVisible, setNameModalVisible] = useState(false);

  // Each time setup enters a "set your code" stage, greet that player with the
  // themed name/color modal before letting them touch the dial.
  useEffect(() => {
    if (stage === 'enter_p1' || stage === 'enter_p2') setNameModalVisible(true);
  }, [stage]);

  const key = (n: number) => setEntry((e) => (e.length >= DUEL_CODE_LENGTH ? e : [...e, n]));
  const del = () => setEntry((e) => e.slice(0, -1));

  const confirm = () => {
    if (entry.length < DUEL_CODE_LENGTH) return;
    const finalName = name.trim() || (stage === 'enter_p1' ? 'Player 1' : 'Player 2');
    if (stage === 'enter_p1') {
      setP1({ name: finalName, color: swatch, secret: entry });
      setEntry([]);
      setName('');
      // Default Player 2 to a different color than whatever Player 1 picked.
      setSwatch(DUEL_COLORS.find((c) => c !== swatch) ?? DUEL_COLORS[0]);
      setStage('pass_p2');
    } else if (stage === 'enter_p2') {
      navigation.replace('DuelGame', {
        p1: p1!,
        p2: { name: finalName, color: swatch, secret: entry },
      });
    }
  };

  if (stage === 'pass_p1') {
    return (
      <PassDeviceCard
        heading="2-PLAYER DUEL"
        title="PLAYER 1"
        subtitle="Set a secret code Player 2 will try to crack. Keep the screen to yourself."
        buttonLabel="I'M READY"
        onReady={() => setStage('enter_p1')}
      />
    );
  }

  if (stage === 'pass_p2') {
    return (
      <PassDeviceCard
        heading="PASS THE DEVICE"
        title="PLAYER 2"
        subtitle="Now set your own secret code — Player 1 won't see it."
        buttonLabel="I'M READY"
        onReady={() => setStage('enter_p2')}
      />
    );
  }

  const playerLabel = stage === 'enter_p1' ? 'PLAYER 1' : 'PLAYER 2';
  const otherColor = stage === 'enter_p2' && p1 ? [p1.color] : [];

  return (
    <Screen horizontalPadding={20}>
      <NameEntryModal
        visible={nameModalVisible}
        playerLabel={playerLabel}
        name={name}
        onChangeName={setName}
        colors={DUEL_COLORS}
        selectedColor={swatch}
        disabledColors={otherColor}
        onSelectColor={setSwatch}
        onConfirm={() => setNameModalVisible(false)}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <IconButton onPress={() => navigation.goBack()}>
          <BackChevronIcon />
        </IconButton>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 15, color: color.textOnDark, letterSpacing: 1.5 }}>
            {playerLabel}: SET YOUR CODE
          </Text>
          <Text style={{ fontFamily: tokens.type.uiSemiBold, fontSize: 11, color: color.brass, letterSpacing: 1 }}>
            {DUEL_CODE_LENGTH} DIGITS · 0–9
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            backgroundColor: 'rgba(242,228,201,0.08)',
            borderWidth: 2,
            borderColor: 'rgba(242,228,201,0.18)',
            borderRadius: 12,
            paddingVertical: 6,
            paddingHorizontal: 10,
          }}
        >
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: swatch }} />
          <Text style={{ fontFamily: tokens.type.uiBold, fontSize: 12, color: color.textOnDark }} numberOfLines={1}>
            {(name.trim() || playerLabel).toUpperCase()}
          </Text>
        </View>
      </View>

      <View
        style={{
          marginTop: 24,
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
          THIS IS YOUR SECRET
        </Text>
        <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
          {Array.from({ length: DUEL_CODE_LENGTH }, (_, i) => (
            <DigitSlot key={i} value={entry[i] !== undefined ? String(entry[i]) : ''} index={i} />
          ))}
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <Keypad
        onKey={key}
        onDel={del}
        onSubmit={confirm}
        canSubmit={entry.length >= DUEL_CODE_LENGTH}
        submitLabel="LOCK IT IN"
      />
    </Screen>
  );
}
