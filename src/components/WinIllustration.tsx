import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { DialFace, RaysIcon, SafeBackPlate } from '../icons';
import { tokens } from '../theme/tokens';

/** One coin tumbling down the win screen — a direct port of the `crk-coin` keyframes. */
export function FallingCoin({
  left,
  top,
  size,
  color,
  delaySec,
  durationSec,
  fallDistance,
}: {
  left: number;
  top: number;
  size: number;
  color: string;
  delaySec: number;
  durationSec: number;
  fallDistance: number;
}) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delaySec * 1000),
        Animated.timing(t, { toValue: 1, duration: durationSec * 1000, useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: 0, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [-size, fallDistance] });
  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '320deg'] });
  const opacity = t.interpolate({ inputRange: [0, 0.08, 0.96, 1], outputRange: [0, 1, 1, 0] });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        borderWidth: 3,
        borderColor: tokens.color.ink,
        opacity,
        transform: [{ translateY }, { rotate }],
      }}
    />
  );
}

/** The pulsing light burst behind the vault — direct port of `crk-rays`. */
function Rays({ size }: { size: number }) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);
  const scale = t.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] });
  const opacity = t.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.9] });
  return (
    <Animated.View style={{ position: 'absolute', width: size, height: size, opacity, transform: [{ scale }] }}>
      <RaysIcon size={size} />
    </Animated.View>
  );
}

/**
 * The safe: a static back plate revealed behind a door that swings open on its
 * hinge and swings back shut, looping — a port of `crk-swing`, using RN's
 * perspective+rotateY transform (the same trick used for card-flip UI) pivoted
 * around the door's left edge to match the mockup's `transform-origin:0% 50%`.
 */
export function SwingingSafe({ size = 300 }: { size?: number }) {
  const angle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(angle, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.delay(3300),
        Animated.timing(angle, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.delay(200),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  const rotateY = angle.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-76deg'] });
  const half = size / 2;

  return (
    <View style={{ width: size, height: size }}>
      <Rays size={size} />
      <View style={{ position: 'absolute', width: size, height: size }}>
        <SafeBackPlate size={size} />
      </View>
      <Animated.View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          transform: [{ perspective: 700 }, { translateX: -half }, { rotateY }, { translateX: half }],
        }}
      >
        <DialFace size={size} />
      </Animated.View>
    </View>
  );
}
