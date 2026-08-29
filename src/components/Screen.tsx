import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tokens } from '../theme/tokens';

type Props = {
  children?: React.ReactNode;
  /** Gradient stops; defaults to the standard dark vault backdrop. */
  colors?: [string, string, ...string[]];
  gradientType?: 'linear' | 'radial-ish';
  horizontalPadding?: number;
  style?: ViewStyle;
};

/**
 * Full-bleed screen background + safe-area padding.
 *
 * The mockup drew every screen inside a fake rounded "phone" bezel with fixed
 * pixel padding (e.g. `padding: 64px 24px 28px`) because it was staged as a
 * device frame on an infinite canvas. On a real device the OS chrome already
 * carves out that space, so here the frame is dropped and the same relative
 * spacing is re-derived from the device's actual safe-area insets instead.
 */
export function Screen({
  children,
  colors = [tokens.color.bgDeep, tokens.color.bgMidnight],
  horizontalPadding = 24,
  style,
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.fill}>
      <LinearGradient colors={colors} style={StyleSheet.absoluteFill} />
      <View
        style={[
          styles.fill,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 16,
            paddingHorizontal: horizontalPadding,
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
