import React, { useEffect, useRef } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { ShadowButton } from '../components/ShadowButton';
import { SwingingSafe, FallingCoin } from '../components/WinIllustration';
import { tokens } from '../theme/tokens';
import { MAX_ATTEMPTS } from '../game/useVaultGame';
import { playSound } from '../audio/sounds';
import { shareViewAsImage } from '../utils/shareImage';

const { color } = tokens;

const COINS = [
  { left: 60, top: 120, size: 16, color: color.brass, delay: 0.2, duration: 2.8 },
  { left: 140, top: 100, size: 12, color: color.misplaced, delay: 1.1, duration: 3.4 },
  { left: 250, top: 110, size: 15, color: color.brass, delay: 0.7, duration: 3.0 },
  { left: 320, top: 130, size: 11, color: color.misplaced, delay: 1.7, duration: 3.6 },
  { left: 200, top: 90, size: 13, color: color.vaultCream, delay: 2.2, duration: 3.2 },
];

type Props = NativeStackScreenProps<RootStackParamList, 'Win'>;

export function WinScreen({ navigation, route }: Props) {
  const { codeLength, label, attempts } = route.params;
  const { width: screenW, height: screenH } = useWindowDimensions();
  const shareRef = useRef<View>(null);
  // Coin positions/timings are lifted straight from the mockup's 390×844 canvas;
  // scale them to whatever device this actually renders on.
  const sx = (px: number) => (px / 390) * screenW;
  const sy = (px: number) => (px / 844) * screenH;

  useEffect(() => {
    playSound('win');
  }, []);

  const share = () => void shareViewAsImage(shareRef, `Share ${label} result`);

  const playAgain = () => navigation.replace('Game', { codeLength, label });

  return (
    <Screen colors={['#155257', color.bgDeep, color.bgMidnight]} style={{ alignItems: 'center' }}>
      {COINS.map((c, i) => (
        <FallingCoin
          key={i}
          left={sx(c.left)}
          top={sy(c.top)}
          size={c.size}
          color={c.color}
          delaySec={c.delay}
          durationSec={c.duration}
          fallDistance={sy(760)}
        />
      ))}

      <View ref={shareRef} collapsable={false} style={{ alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: tokens.type.display,
            fontSize: 40,
            color: color.exact,
            letterSpacing: 2,
            textShadowColor: color.ink,
            textShadowOffset: { width: 0, height: 3 },
          }}
        >
          CRACKED!
        </Text>
        <Text style={{ fontFamily: tokens.type.uiSemiBold, fontSize: 15, color: color.textOnDark, marginTop: 6 }}>
          Vault opened in {attempts} attempt{attempts === 1 ? '' : 's'}
        </Text>

        <View style={{ flexDirection: 'row', gap: 6, marginTop: 12 }}>
          {Array.from({ length: MAX_ATTEMPTS }, (_, i) => {
            const isWinner = i === attempts - 1;
            const used = i < attempts - 1;
            const bg = isWinner ? color.exact : used ? '#334F50' : color.misplaced;
            return <View key={i} style={{ width: 18, height: 7, borderRadius: 4, backgroundColor: bg, borderWidth: 2, borderColor: used ? '#243D3E' : color.ink }} />;
          })}
        </View>

        <View style={{ marginTop: 36 }}>
          <SwingingSafe size={Math.min(300, screenW * 0.78)} />
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <View style={{ width: '100%', gap: 12 }}>
        <ShadowButton bg={color.exact} edgeColor={color.exactEdge} radius={18} edgeDepth={6} style={styles.cta} onPress={share}>
          <Text style={[styles.ctaText, { color: color.ink }]}>SHARE RESULT</Text>
        </ShadowButton>
        <ShadowButton bg={color.coral} edgeColor={color.coralEdge} radius={18} edgeDepth={6} style={styles.cta} onPress={playAgain}>
          <Text style={[styles.ctaText, { color: '#fff' }]}>NEXT VAULT</Text>
        </ShadowButton>
      </View>
    </Screen>
  );
}

const styles = {
  cta: { paddingVertical: 17, alignItems: 'center' as const },
  ctaText: { fontFamily: tokens.type.uiExtraBold, fontSize: 19, letterSpacing: 1 },
};
