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
      {pins.map((p, i) => (
        <FeedbackPin key={i} state={p} animate={animatePins} delay={i * 100} size={pinSize} />
      ))}
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
