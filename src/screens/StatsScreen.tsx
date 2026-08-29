import React from 'react';
import { Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { IconButton } from '../components/IconButton';
import { BackChevronIcon } from '../icons';
import { tokens } from '../theme/tokens';
import { useStatsStore, winRatePercent } from '../store/statsStore';

const { color } = tokens;

type Props = NativeStackScreenProps<RootStackParamList, 'Stats'>;

export function StatsScreen({ navigation }: Props) {
  const stats = useStatsStore();
  const dist = stats.attemptDistribution;
  const maxCount = Math.max(...dist);
  const hasData = stats.gamesPlayed > 0 && maxCount > 0;
  const bestIndex = hasData ? dist.indexOf(maxCount) : -1;
  const lossesNotShown = stats.gamesPlayed - stats.wins;

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <IconButton onPress={() => navigation.goBack()}>
          <BackChevronIcon />
        </IconButton>
        <Text style={{ fontFamily: tokens.type.display, fontSize: 24, color: color.textOnDark, letterSpacing: 1 }}>
          STATS
        </Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <StatCard value={String(stats.gamesPlayed)} label="GAMES PLAYED" bg={color.vaultCream} valueColor={color.ink} labelColor={color.brownMuted} edgeColor={color.creamEdge} />
        <StatCard value={`${winRatePercent(stats)}%`} label="WIN RATE" bg={color.exact} valueColor={color.ink} labelColor="#0B4A31" edgeColor={color.exactEdge} />
        <StatCard value={String(stats.currentStreak)} label="CURRENT STREAK" bg={color.misplaced} valueColor={color.ink} labelColor="#6E4E0C" edgeColor={color.misplacedEdge} />
        <StatCard value={String(stats.bestStreak)} label="BEST STREAK" bg={color.brass} valueColor={color.ink} labelColor="#6E4E0C" edgeColor={color.brassEdge} />
      </View>

      <View
        style={{
          marginTop: 26,
          backgroundColor: 'rgba(242,228,201,0.07)',
          borderWidth: 2,
          borderColor: 'rgba(242,228,201,0.16)',
          borderRadius: 20,
          padding: 18,
          flex: 1,
        }}
      >
        <Text style={{ fontFamily: tokens.type.uiBold, fontSize: 12, color: 'rgba(242,228,201,0.6)', letterSpacing: 3, marginBottom: 16 }}>
          ATTEMPT DISTRIBUTION
        </Text>
        {!hasData ? (
          <Text style={{ fontFamily: tokens.type.uiMedium, fontSize: 13, color: 'rgba(242,228,201,0.45)', paddingVertical: 8 }}>
            Crack your first vault to start filling this in.
          </Text>
        ) : (
          <View style={{ gap: 8 }}>
            {dist.map((count, i) => {
              const attempt = i + 1;
              const isBest = i === bestIndex;
              const widthPct = Math.max((count / maxCount) * 62, 4);
              return (
                <View key={attempt} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text
                    style={{
                      fontFamily: tokens.type.uiBold,
                      fontSize: 12,
                      width: 16,
                      textAlign: 'right',
                      color: isBest ? color.textOnDark : color.slateMuted,
                    }}
                  >
                    {attempt}
                  </Text>
                  <View
                    style={{
                      height: 20,
                      borderRadius: 6,
                      backgroundColor: isBest ? color.exact : count === 0 ? '#5E7577' : color.misplaced,
                      borderWidth: 2,
                      borderColor: color.ink,
                      width: `${widthPct}%`,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: isBest ? tokens.type.uiExtraBold : tokens.type.uiBold,
                      fontSize: 12,
                      color: isBest ? color.exact : 'rgba(242,228,201,0.5)',
                    }}
                  >
                    {count}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
        {hasData && (
          <Text style={{ fontFamily: tokens.type.uiMedium, fontSize: 11.5, color: 'rgba(242,228,201,0.4)', marginTop: 14 }}>
            Green marks your most common solve.
            {lossesNotShown > 0 ? ` ${lossesNotShown} loss${lossesNotShown === 1 ? '' : 'es'} not shown.` : ''}
          </Text>
        )}
      </View>
    </Screen>
  );
}

function StatCard({
  value,
  label,
  bg,
  valueColor,
  labelColor,
  edgeColor,
}: {
  value: string;
  label: string;
  bg: string;
  valueColor: string;
  labelColor: string;
  edgeColor: string;
}) {
  return (
    <View
      style={{
        width: '47.5%',
        backgroundColor: bg,
        borderWidth: 3,
        borderColor: color.ink,
        borderBottomWidth: 6,
        borderBottomColor: edgeColor,
        borderRadius: 18,
        padding: 18,
        marginBottom: 3,
      }}
    >
      <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 32, color: valueColor }}>{value}</Text>
      <Text style={{ fontFamily: tokens.type.uiBold, fontSize: 11, color: labelColor, letterSpacing: 2 }}>{label}</Text>
    </View>
  );
}
