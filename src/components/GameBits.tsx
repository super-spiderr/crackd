import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { tokens } from '../theme/tokens';

const { color } = tokens;

/** The bar-shaped attempt-budget indicator above the dial ("pips" in the source script). */
export function AttemptPip({ used, isNext }: { used: boolean; isNext: boolean }) {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isNext) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1500, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0, duration: 1500, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isNext, pulse]);

  const shadowOpacity = isNext ? pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.8] }) : 0;

  return (
    <Animated.View
      style={{
        width: 20,
        height: 8,
        borderRadius: 5,
        backgroundColor: used ? '#334F50' : color.misplaced,
        borderWidth: 2,
        borderColor: used ? '#243D3E' : color.ink,
        shadowColor: color.misplaced,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 5,
        shadowOpacity: shadowOpacity as unknown as number,
      }}
    />
  );
}

/**
 * One feedback pin: exact and misplaced differ in shape as well as color
 * (filled disc vs. a hollow ring), not color alone — colorblind players
 * can't otherwise tell them apart. A true miss is a smaller, dim dot.
 */
export function FeedbackPin({
  state,
  animate,
  delay = 0,
  size = 17,
}: {
  state: 'exact' | 'misplaced' | 'dead';
  animate?: boolean;
  delay?: number;
  size?: number;
}) {
  const drop = useRef(new Animated.Value(animate ? 0 : 1)).current;
  useEffect(() => {
    if (!animate) return;
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(drop, { toValue: 1, useNativeDriver: true, friction: 6, tension: 120 }),
    ]).start();
  }, [animate, delay, drop]);

  const scale = drop.interpolate({ inputRange: [0, 1], outputRange: [1.4, 1] });
  const translateY = drop.interpolate({ inputRange: [0, 1], outputRange: [-12, 0] });
  const opacity = drop;

  if (state === 'dead') {
    const dotSize = size * 0.5;
    return (
      <Animated.View
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          opacity,
          transform: [{ translateY }, { scale }],
        }}
      >
        <View style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: color.deadBorder }} />
      </Animated.View>
    );
  }

  if (state === 'misplaced') {
    // Hollow ring — same amber as before, but an outline instead of a filled disc.
    const ringWidth = Math.max(2.5, size * 0.22);
    return (
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'transparent',
          borderWidth: ringWidth,
          borderColor: color.misplaced,
          opacity,
          transform: [{ translateY }, { scale }],
        }}
      />
    );
  }

  // exact — filled disc
  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color.exact,
        borderWidth: Math.max(2, size * 0.18),
        borderColor: color.ink,
        opacity,
        transform: [{ translateY }, { scale }],
      }}
    />
  );
}

/**
 * The feedback pins for one guess, bunched into a compact 2-column peg
 * cluster (classic Mastermind pegboard) instead of a single row.
 *
 * This matters: pins are deliberately sorted (all exact, then all misplaced,
 * then dead — see engine invariants) so their order never reveals *which*
 * guessed digit they belong to. Laid out as one row directly across from the
 * digit cells, that sorted order reads as if pin N corresponds to digit N —
 * a player naturally assumes "the green one is under my first digit." A
 * 2-column cluster breaks that visual line-up on sight.
 */
export function PinCluster({
  pins,
  animate,
  pinSize = 17,
}: {
  pins: ('exact' | 'misplaced' | 'dead')[];
  animate?: boolean;
  pinSize?: number;
}) {
  const gap = Math.max(3, pinSize * 0.24);
  return (
    <View style={{ width: pinSize * 2 + gap, flexDirection: 'row', flexWrap: 'wrap', gap, justifyContent: 'flex-end' }}>
      {pins.map((p, i) => (
        <FeedbackPin key={i} state={p} animate={animate} delay={i * 100} size={pinSize} />
      ))}
    </View>
  );
}

/** Spells out what the three pin states mean, and that their order is shuffled — not lined up with the guessed digits. */
export function PinLegend() {
  return (
    <View style={{ gap: 4, paddingBottom: 4 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        <LegendItem state="exact" label="right spot" />
        <LegendItem state="misplaced" label="wrong spot" />
        <LegendItem state="dead" label="not in code" />
      </View>
      <Text
        style={{
          textAlign: 'center',
          fontFamily: tokens.type.uiMedium,
          fontSize: 10.5,
          color: 'rgba(242,228,201,0.4)',
        }}
      >
        Shuffled each guess — not matched to a digit.
      </Text>
    </View>
  );
}

function LegendItem({ state, label }: { state: 'exact' | 'misplaced' | 'dead'; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <FeedbackPin state={state} size={12} />
      <Text style={{ fontFamily: tokens.type.uiMedium, fontSize: 11, color: 'rgba(242,228,201,0.55)' }}>{label}</Text>
    </View>
  );
}

/** One row of the attempt history: the digits that were guessed + their feedback pins. */
export function GuessRow({
  n,
  digits,
  pins,
  animatePins,
  cellSize = 32,
  pinSize = 17,
  gap = 8,
}: {
  n: number;
  digits: number[];
  pins: ('exact' | 'misplaced' | 'dead')[];
  animatePins?: boolean;
  cellSize?: number;
  pinSize?: number;
  gap?: number;
}) {
  return (
    <View style={[styles.row, { gap }]}>
      <Text style={styles.n}>#{n}</Text>
      {digits.map((d, i) => (
        <View
          key={i}
          style={[
            styles.cell,
            { width: cellSize, height: cellSize * 1.19, borderRadius: Math.max(6, cellSize * 0.28) },
          ]}
        >
          <Text style={[styles.cellText, { fontSize: cellSize * 0.53 }]}>{d}</Text>
        </View>
      ))}
      <View style={{ flex: 1 }} />
      <PinCluster pins={pins} animate={animatePins} pinSize={pinSize} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: 'rgba(242,228,201,0.07)',
    borderWidth: 2,
    borderColor: 'rgba(242,228,201,0.16)',
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  n: { fontFamily: tokens.type.uiBold, fontSize: 11, color: 'rgba(242,228,201,0.4)', width: 22 },
  cell: {
    backgroundColor: color.bgDeep,
    borderWidth: 2.5,
    borderColor: color.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: { fontFamily: tokens.type.display, color: color.textOnDark },
});
