import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { LoseSafeIcon } from '../icons';

/** The sealed, siren-taped safe — ports `crk-shake`'s brief rattle near the end of each 4s loop. */
export function ShakingSafe({ size = 270 }: { size?: number }) {
  const pos = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    const seg = (x: number, y: number, duration: number) =>
      Animated.timing(pos, { toValue: { x, y }, duration, useNativeDriver: true });

    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(3200),
        seg(-6, 2, 160),
        seg(6, -2, 160),
        seg(-4, 1, 160),
        seg(3, 0, 160),
        seg(0, 0, 160),
        Animated.delay(160),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View style={{ transform: pos.getTranslateTransform() }}>
      <LoseSafeIcon size={size} />
    </Animated.View>
  );
}

/** Full-bleed red flash behind the Lose screen — ports `crk-alarm`. */
export function AlarmOverlay() {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, []);
  const opacity = t.interpolate({ inputRange: [0, 1], outputRange: [0.1, 0.34] });
  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, { backgroundColor: '#D63A3A', opacity }]}
    />
  );
}
