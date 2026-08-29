import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import { tokens } from '../theme/tokens';
import { playSound } from '../audio/sounds';

/** The small raised square icon button used for header back-buttons etc. */
export function IconButton({
  onPress,
  children,
  size = 38,
}: {
  onPress?: () => void;
  children?: React.ReactNode;
  size?: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  const pressIn = () => {
    playSound('tap');
    Animated.timing(anim, { toValue: 1, duration: 80, useNativeDriver: true }).start();
  };
  const pressOut = () => Animated.timing(anim, { toValue: 0, duration: 120, useNativeDriver: true }).start();
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 2] });

  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut} hitSlop={8}>
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: 12,
          backgroundColor: tokens.color.surfaceRaised,
          borderWidth: 2.5,
          borderColor: tokens.color.surfaceRaisedEdge,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ translateY }],
        }}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
