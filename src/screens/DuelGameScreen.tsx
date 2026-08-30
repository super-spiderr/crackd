import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { PassDeviceCard } from '../components/PassDeviceCard';
import { ShadowButton } from '../components/ShadowButton';
import { DigitSlot } from '../components/DigitSlot';
import { AttemptPip, GuessRow, PinLegend } from '../components/GameBits';
import { Keypad } from '../components/Keypad';
import { ShareIcon } from '../icons';
import { AttemptReview } from '../components/AttemptReview';
import { tokens } from '../theme/tokens';
import { mixHex } from '../theme/colorMix';
import { MAX_ATTEMPTS, useVaultGame } from '../game/useVaultGame';
import { DUEL_CODE_LENGTH, type DuelPlayer } from '../game/duelConstants';
import { comboSlotSizing, guessRowSizing } from '../theme/responsiveDigits';
import { playSound } from '../audio/sounds';
import { useDuelHistoryStore } from '../store/duelHistoryStore';
import { shareViewAsImage } from '../utils/shareImage';

const { color } = tokens;

type PlayerKey = 'p1' | 'p2';
type Stage = 'pass' | 'guessing' | 'result';
type MatchResult = { type: 'win'; winner: PlayerKey } | { type: 'draw' };

type Props = NativeStackScreenProps<RootStackParamList, 'DuelGame'>;

export function DuelGameScreen({ navigation, route }: Props) {
  const { p1: p1Info, p2: p2Info } = route.params;
  const codeLength = DUEL_CODE_LENGTH;
  const info: Record<PlayerKey, DuelPlayer> = { p1: p1Info, p2: p2Info };

  // Each player's hook instance is preset to the *other* player's secret —
  // p1 is "the guesser trying to crack p2's code", and vice versa.
  const p1 = useVaultGame(codeLength, { presetSecret: p2Info.secret });
  const p2 = useVaultGame(codeLength, { presetSecret: p1Info.secret });
  const games: Record<PlayerKey, ReturnType<typeof useVaultGame>> = { p1, p2 };

  const [stage, setStage] = useState<Stage>('pass');
  const [active, setActive] = useState<PlayerKey>('p1');
  const [awaitingHandoff, setAwaitingHandoff] = useState(false);
  const [pendingNext, setPendingNext] = useState<PlayerKey | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const prevCount = useRef<Record<PlayerKey, number>>({ p1: 0, p2: 0 });
  const resultCardRef = useRef<View>(null);

  const combo = comboSlotSizing(codeLength);
  const rowSizing = guessRowSizing(codeLength);

  // Fires once whenever the *active* player's guess resolves (their guesses
  // array grows). Decides whether the match just ended, or whose turn is next.
  useEffect(() => {
    if (stage !== 'guessing' || awaitingHandoff) return;
    const cur = games[active];
    if (cur.guesses.length <= prevCount.current[active]) return;
    prevCount.current[active] = cur.guesses.length;

    if (cur.phase === 'won') {
      playSound('win');
      setResult({ type: 'win', winner: active });
      setStage('result');
      useDuelHistoryStore.getState().recordMatch({
        winnerIndex: active === 'p1' ? 0 : 1,
        p1: p1Info,
        p1Attempts: games.p1.guesses.length,
        p2: p2Info,
        p2Attempts: games.p2.guesses.length,
      });
      return;
    }

    const other: PlayerKey = active === 'p1' ? 'p2' : 'p1';
    const otherStillPlaying = games[other].phase === 'play';
    const curStillPlaying = cur.phase === 'play';

    if (!otherStillPlaying && !curStillPlaying) {
      playSound('lose');
      setResult({ type: 'draw' });
      setStage('result');
      useDuelHistoryStore.getState().recordMatch({
        winnerIndex: null,
        p1: p1Info,
        p1Attempts: games.p1.guesses.length,
        p2: p2Info,
        p2Attempts: games.p2.guesses.length,
      });
      return;
    }

    // Whoever's still able to play goes next; if only the current player can
    // still play (the other already used all their attempts), it's their turn again.
    setPendingNext(otherStillPlaying ? other : active);
    setAwaitingHandoff(true);
  }, [p1.guesses.length, p2.guesses.length, stage, awaitingHandoff, active]);

  if (stage === 'pass') {
    const opponent: PlayerKey = active === 'p1' ? 'p2' : 'p1';
    const opponentOut = games[opponent].phase !== 'play';
    return (
      <PassDeviceCard
        heading={prevCount.current.p1 + prevCount.current.p2 === 0 ? '2-PLAYER DUEL' : 'PASS THE DEVICE'}
        title={info[active].name.toUpperCase()}
        accentColor={info[active].color}
        subtitle={
          opponentOut
            ? `${info[opponent].name} is out of attempts — keep going alone to crack the code.`
            : `Try to crack ${info[opponent].name}'s code. They won't see your guesses.`
        }
        buttonLabel="I'M READY"
        onReady={() => setStage('guessing')}
      />
    );
  }

  if (stage === 'result' && result) {
    const winner = result.type === 'win' ? info[result.winner] : null;
    const bgTop =
      result.type === 'win' && winner ? mixHex(winner.color, color.bgDeep, 0.55) : color.bgMidnight;
    return (
      <Screen colors={[bgTop, color.bgDeep, color.bgMidnight]} style={{ alignItems: 'center' }}>
        <View style={{ flex: 1 }} />
        <View ref={resultCardRef} collapsable={false} style={{ alignItems: 'center' }}>
          <Text
            style={{
              fontFamily: tokens.type.display,
              fontSize: 34,
              color: winner ? winner.color : color.coral,
              letterSpacing: 1,
              textAlign: 'center',
            }}
          >
            {winner ? `${winner.name.toUpperCase()} CRACKS IT!` : 'BOTH VAULTS HOLD'}
          </Text>
          <Text
            style={{
              fontFamily: tokens.type.uiSemiBold,
              fontSize: 14,
              color: 'rgba(242,228,201,0.75)',
              marginTop: 10,
              textAlign: 'center',
              paddingHorizontal: 30,
            }}
          >
            {result.type === 'win' && winner
              ? `${winner.name} opened it in ${games[result.winner!].guesses.length} attempt${games[result.winner!].guesses.length === 1 ? '' : 's'}.`
              : `Neither player cracked the other's code in ${MAX_ATTEMPTS} attempts.`}
          </Text>

          <View style={{ flexDirection: 'row', gap: 24, marginTop: 28 }}>
            <CodeReveal label={`${p1Info.name.toUpperCase()}'S CODE WAS`} code={p1Info.secret} accentColor={p1Info.color} />
            <CodeReveal label={`${p2Info.name.toUpperCase()}'S CODE WAS`} code={p2Info.secret} accentColor={p2Info.color} />
          </View>
        </View>

        <View style={{ width: '100%', marginTop: 18, gap: 4 }}>
          <AttemptReview
            label={`${p1Info.name.toUpperCase()}'S ATTEMPTS`}
            secret={p2Info.secret}
            guesses={games.p1.guesses}
            accentColor={p1Info.color}
          />
          <AttemptReview
            label={`${p2Info.name.toUpperCase()}'S ATTEMPTS`}
            secret={p1Info.secret}
            guesses={games.p2.guesses}
            accentColor={p2Info.color}
          />
        </View>

        <View style={{ flex: 1 }} />

        <View style={{ width: '100%', gap: 12 }}>
          <ShadowButton
            bg={color.brass}
            edgeColor={color.brassEdge}
            radius={18}
            edgeDepth={6}
            style={{ paddingVertical: 15, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
            onPress={() => {
              playSound('tap');
              void shareViewAsImage(resultCardRef, 'Share duel result');
            }}
          >
            <ShareIcon size={15} tint={color.ink} />
            <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 15, color: color.ink, letterSpacing: 1 }}>
              SHARE RESULT
            </Text>
          </ShadowButton>
          <ShadowButton
            bg={color.coral}
            edgeColor={color.coralEdge}
            radius={18}
            edgeDepth={6}
            style={{ paddingVertical: 17, alignItems: 'center' }}
            onPress={() => navigation.replace('DuelSetup')}
          >
            <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 18, color: '#fff', letterSpacing: 1 }}>
              REMATCH
            </Text>
          </ShadowButton>
          <ShadowButton
            bg="transparent"
            borderColor="rgba(242,228,201,0.35)"
            radius={18}
            edgeDepth={0}
            style={{ paddingVertical: 15, alignItems: 'center' }}
            onPress={() => navigation.popToTop()}
          >
            <Text style={{ fontFamily: tokens.type.uiBold, fontSize: 15, color: 'rgba(242,228,201,0.75)' }}>
              BACK TO HOME
            </Text>
          </ShadowButton>
        </View>
      </Screen>
    );
  }

  // stage === 'guessing'
  const cur = games[active];
  const curInfo = info[active];
  const opponent: PlayerKey = active === 'p1' ? 'p2' : 'p1';
  const canSubmit = cur.entry.length >= codeLength && !cur.spinning;
  const reversedGuesses = [...cur.guesses].reverse();
  const bgTop = mixHex(curInfo.color, color.bgDeep, 0.78);

  return (
    <Screen colors={[bgTop, color.bgMidnight]} horizontalPadding={20}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 10,
            height: 34,
            borderRadius: 5,
            backgroundColor: curInfo.color,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 15, color: color.textOnDark, letterSpacing: 1.5 }}>
            {curInfo.name.toUpperCase()} VS {info[opponent].name.toUpperCase()}
          </Text>
          <Text style={{ fontFamily: tokens.type.uiSemiBold, fontSize: 11, color: color.brass, letterSpacing: 1 }}>
            {codeLength} DIGITS · 0–9
          </Text>
        </View>
        <Text style={{ fontFamily: tokens.type.uiBold, fontSize: 12, color: 'rgba(242,228,201,0.6)' }}>
          {cur.guesses.length} / {MAX_ATTEMPTS}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 7, justifyContent: 'center', marginVertical: 13 }}>
        {Array.from({ length: MAX_ATTEMPTS }, (_, i) => (
          <AttemptPip key={i} used={i < cur.guesses.length} isNext={i === cur.guesses.length} />
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
              value={cur.entry[i] !== undefined ? String(cur.entry[i]) : ''}
              spinning={cur.spinning}
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
        {cur.guesses.length === 0 && (
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
            key={cur.guesses.length - ri}
            n={cur.guesses.length - ri}
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

      {awaitingHandoff && pendingNext ? (
        <ShadowButton
          bg={info[pendingNext].color}
          edgeColor={mixHex(info[pendingNext].color, color.ink, 0.35)}
          radius={18}
          edgeDepth={6}
          style={{ paddingVertical: 18, alignItems: 'center' }}
          onPress={() => {
            setActive(pendingNext);
            setAwaitingHandoff(false);
            setPendingNext(null);
            setStage('pass');
          }}
        >
          <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 16, color: '#fff', letterSpacing: 1 }}>
            PASS THE DEVICE →
          </Text>
        </ShadowButton>
      ) : (
        <Keypad onKey={cur.key} onDel={cur.del} onSubmit={cur.submit} canSubmit={canSubmit} />
      )}
    </Screen>
  );
}

function CodeReveal({ label, code, accentColor }: { label: string; code: number[]; accentColor: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text
        style={{
          fontFamily: tokens.type.uiBold,
          fontSize: 10.5,
          color: accentColor,
          letterSpacing: 1.5,
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {code.map((d, i) => (
          <View
            key={i}
            style={{
              width: 32,
              height: 40,
              backgroundColor: color.vaultCream,
              borderWidth: 2.5,
              borderColor: color.ink,
              borderRadius: 9,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: tokens.type.display, fontSize: 18, color: color.ink }}>{d}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
