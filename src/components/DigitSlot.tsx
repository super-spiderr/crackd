import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import { tokens } from '../theme/tokens';

type Props = {
  value: string;
  spinning?: boolean;
  index?: number;
  size?: number;
};

/** One digit cell of the combination dial. Bounces through the `crk-dialspin` keyframes while a guess is resolving. */
export function DigitSlot({ value, spinning, index = 0, size = 58 }: Props) {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!spinning) return;
    y.setValue(0);
    const delay = index * 150;
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(y, { toValue: -11, duration: 125, useNativeDriver: true }),
      Animated.timing(y, { toValue: 8, duration: 150, useNativeDriver: true }),
      Animated.timing(y, { toValue: -3, duration: 125, useNativeDriver: true }),
      Animated.timing(y, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  }, [spinning, index, y]);

  return (
    <Animated.View
      style={{
        width: size,
        height: size * 1.276,
        backgroundColor: tokens.color.bgDeep,
        borderWidth: 3,
        borderColor: tokens.color.ink,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ translateY: y }],
      }}
    >
      <Text style={{ fontFamily: tokens.type.display, fontSize: size * 0.586, color: tokens.color.textOnDark }}>
        {value}
      </Text>
    </Animated.View>
  );
}
