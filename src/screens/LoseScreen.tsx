import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { ShadowButton } from '../components/ShadowButton';
import { AlarmOverlay, ShakingSafe } from '../components/LoseIllustration';
import { AttemptReview } from '../components/AttemptReview';
import { tokens } from '../theme/tokens';
import { MAX_ATTEMPTS } from '../game/useVaultGame';
import { playSound } from '../audio/sounds';
import { codeRevealSizing } from '../theme/responsiveDigits';

const { color } = tokens;

type Props = NativeStackScreenProps<RootStackParamList, 'Lose'>;

export function LoseScreen({ navigation, route }: Props) {
  const { codeLength, label, code, guesses } = route.params;
  const reveal = codeRevealSizing(code.length);

  useEffect(() => {
    playSound('lose');
  }, []);

  const retry = () => navigation.replace('Game', { codeLength, label });
  const home = () => navigation.popToTop();

  return (
    <Screen colors={['#12333B', '#0B242E']} style={{ alignItems: 'center' }}>
      <AlarmOverlay />

      <Text
        style={{
          fontFamily: tokens.type.display,
          fontSize: 38,
          color: color.coral,
          letterSpacing: 2,
          textShadowColor: color.ink,
          textShadowOffset: { width: 0, height: 3 },
        }}
      >
        LOCKDOWN
      </Text>
      <Text
        style={{
          fontFamily: tokens.type.uiSemiBold,
          fontSize: 15,
          color: 'rgba(242,228,201,0.85)',
          marginTop: 6,
          textAlign: 'center',
        }}
      >
        {MAX_ATTEMPTS} of {MAX_ATTEMPTS} attempts used — the vault sealed itself.
      </Text>

      <View style={{ marginTop: 44 }}>
        <ShakingSafe />
      </View>

      <View style={{ marginTop: 40, alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: tokens.type.uiBold,
            fontSize: 12,
            color: 'rgba(242,228,201,0.6)',
            letterSpacing: 3,
            marginBottom: 10,
          }}
        >
          THE CODE WAS
        </Text>
        <View style={{ flexDirection: 'row', gap: reveal.gap }}>
          {code.map((d, i) => (
            <View
              key={i}
              style={{
                width: reveal.box,
                height: reveal.box * 1.22,
                backgroundColor: color.vaultCream,
                borderWidth: 3,
                borderColor: color.ink,
                borderRadius: Math.max(8, reveal.box * 0.24),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: tokens.type.display, fontSize: reveal.box * 0.55, color: color.ink }}>{d}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 16, width: '100%' }}>
        <AttemptReview secret={code} guesses={guesses} accentColor={color.coral} />
      </View>

      <View style={{ flex: 1 }} />

      <View style={{ width: '100%', gap: 12 }}>
        <ShadowButton bg={color.coral} edgeColor={color.coralEdge} radius={18} edgeDepth={6} style={styles.cta} onPress={retry}>
          <Text style={[styles.ctaText, { color: '#fff' }]}>RETRY THIS VAULT</Text>
        </ShadowButton>
        <ShadowButton bg="transparent" borderColor="rgba(242,228,201,0.35)" radius={18} edgeDepth={0} style={styles.flatCta} onPress={home}>
          <Text style={[styles.ctaText, { fontFamily: tokens.type.uiBold, fontSize: 16, color: 'rgba(242,228,201,0.75)' }]}>
            BACK TO HOME
          </Text>
        </ShadowButton>
      </View>
    </Screen>
  );
}

const styles = {
  cta: { paddingVertical: 17, alignItems: 'center' as const },
  flatCta: { paddingVertical: 15, alignItems: 'center' as const },
  ctaText: { fontFamily: tokens.type.uiExtraBold, fontSize: 19, letterSpacing: 1 },
};
