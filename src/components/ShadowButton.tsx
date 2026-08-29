import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { tokens } from '../theme/tokens';
import { playSound, type SoundName } from '../audio/sounds';

type Props = {
  onPress?: () => void;
  disabled?: boolean;
  /** Face color. */
  bg: string;
  /** Bottom "3D edge" color. Omit for a flat button with no raised edge. */
  edgeColor?: string;
  borderColor?: string;
  borderWidth?: number;
  radius?: number;
  /** Rest-state height of the edge strip peeking out below the face. */
  edgeDepth?: number;
  style?: ViewStyle;
  children?: React.ReactNode;
  /** SFX to fire on touch-down. Defaults to the generic UI tap; pass `false` for none. */
  sound?: SoundName | false;
};

/**
 * Recreates the design's signature "chunky 3D button": a face sitting on a
 * solid-color edge, which the face slides down onto when pressed — the RN
 * equivalent of the mockup's `box-shadow: 0 Npx 0 <edge>` + `translateY` press state.
 */
export function ShadowButton({
  onPress,
  disabled,
  bg,
  edgeColor,
  borderColor = tokens.color.ink,
  borderWidth = tokens.border.thick,
  radius = tokens.radius.button,
  edgeDepth = 6,
  style,
  children,
  sound = 'tap',
}: Props) {
  const hasEdge = !!edgeColor && edgeDepth > 0;
  const pressedTranslate = hasEdge ? Math.max(edgeDepth - 2, 0) : Math.min(edgeDepth, 2);
  const anim = useRef(new Animated.Value(0)).current;

  const pressIn = () => {
    if (sound) playSound(sound);
    Animated.timing(anim, { toValue: 1, duration: tokens.motion.keypress, useNativeDriver: true }).start();
  };
  const pressOut = () =>
    Animated.timing(anim, { toValue: 0, duration: tokens.motion.keySpringBack, useNativeDriver: true }).start();

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, pressedTranslate] });

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : pressIn}
      onPressOut={disabled ? undefined : pressOut}
      disabled={disabled}
      style={[{ opacity: disabled ? 0.5 : 1 }]}
    >
      <Animated.View
        style={[
          hasEdge && { paddingBottom: edgeDepth },
          { position: 'relative' },
        ]}
      >
        {hasEdge && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: edgeColor, borderRadius: radius },
            ]}
          />
        )}
        <Animated.View
          style={[
            {
              backgroundColor: bg,
              borderColor,
              borderWidth,
              borderRadius: radius,
              transform: [{ translateY }],
            },
            style,
          ]}
        >
          {children}
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
}
