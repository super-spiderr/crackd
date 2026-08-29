import React from 'react';
import { Text, View } from 'react-native';
import { Screen } from './Screen';
import { ShadowButton } from './ShadowButton';
import { DialLogoIcon } from '../icons';
import { tokens } from '../theme/tokens';
import { mixHex } from '../theme/colorMix';

const { color } = tokens;

/**
 * The hand-off screen shown between every turn of a local pass-and-play
 * duel — hides whatever the previous player was looking at (their own
 * secret, or their own guess board) before the next player takes the device.
 */
export function PassDeviceCard({
  heading,
  title,
  subtitle,
  buttonLabel,
  onReady,
  accentColor,
}: {
  /** Small eyebrow label, e.g. "PASS THE DEVICE". */
  heading: string;
  /** The player's name/role, e.g. "PLAYER 2". */
  title: string;
  subtitle: string;
  buttonLabel: string;
  onReady: () => void;
  /** The player's chosen duel color — tints the backdrop and title so whose turn it is reads at a glance. */
  accentColor?: string;
}) {
  const bgTop = accentColor ? mixHex(accentColor, color.bgDeep, 0.72) : color.bgDeep;

  return (
    <Screen colors={[bgTop, color.bgMidnight]} style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', gap: 14 }}>
        <DialLogoIcon size={64} />
        <Text
          style={{
            fontFamily: tokens.type.uiBold,
            fontSize: 12,
            color: accentColor ?? color.brass,
            letterSpacing: 3,
          }}
        >
          {heading}
        </Text>
        <Text
          style={{
            fontFamily: tokens.type.display,
            fontSize: 34,
            color: color.textOnDark,
            letterSpacing: 1,
            textAlign: 'center',
          }}
        >
          {title}
        </Text>
        <Text
          style={{
            fontFamily: tokens.type.uiMedium,
            fontSize: 14,
            color: 'rgba(242,228,201,0.6)',
            textAlign: 'center',
            paddingHorizontal: 20,
          }}
        >
          {subtitle}
        </Text>
      </View>

      <View style={{ height: 60 }} />

      <ShadowButton
        bg={accentColor ?? color.coral}
        edgeColor={accentColor ? mixHex(accentColor, color.ink, 0.35) : color.coralEdge}
        radius={20}
        edgeDepth={6}
        style={{ paddingVertical: 18, paddingHorizontal: 36, alignItems: 'center' }}
        onPress={onReady}
      >
        <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 17, color: '#fff', letterSpacing: 1 }}>
          {buttonLabel}
        </Text>
      </ShadowButton>
    </Screen>
  );
}
