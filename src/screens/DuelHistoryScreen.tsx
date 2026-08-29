import React, { useRef } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { Screen } from '../components/Screen';
import { IconButton } from '../components/IconButton';
import { BackChevronIcon, ShareIcon } from '../icons';
import { tokens } from '../theme/tokens';
import { playSound } from '../audio/sounds';
import { useDuelHistoryStore, type DuelHistoryPlayer, type DuelMatchRecord } from '../store/duelHistoryStore';
import { shareViewAsImage } from '../utils/shareImage';

const { color } = tokens;

type Props = NativeStackScreenProps<RootStackParamList, 'DuelHistory'>;

export function DuelHistoryScreen({ navigation }: Props) {
  const matches = useDuelHistoryStore((s) => s.matches);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <IconButton onPress={() => navigation.goBack()}>
          <BackChevronIcon />
        </IconButton>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: tokens.type.display, fontSize: 22, color: color.textOnDark, letterSpacing: 1 }}>
            MATCH HISTORY
          </Text>
          <Text style={{ fontFamily: tokens.type.uiSemiBold, fontSize: 11.5, color: 'rgba(242,228,201,0.5)' }}>
            2-player pass &amp; play results
          </Text>
        </View>
      </View>

      {matches.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
          <Text
            style={{
              fontFamily: tokens.type.uiMedium,
              fontSize: 14,
              color: 'rgba(242,228,201,0.45)',
              textAlign: 'center',
            }}
          >
            No duels yet. Play a 2-player duel and the result will show up here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
          {matches.map((m) => (
            <HistoryCard key={m.id} match={m} />
          ))}
        </ScrollView>
      )}
    </Screen>
  );
}

function HistoryCard({ match }: { match: DuelMatchRecord }) {
  const ref = useRef<View>(null);
  const [a, b] = match.players;
  const date = new Date(match.playedAt);
  const dateLabel = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  const onShare = () => {
    playSound('tap');
    void shareViewAsImage(ref, 'Share duel result');
  };

  return (
    <View
      ref={ref}
      collapsable={false}
      style={{
        backgroundColor: 'rgba(242,228,201,0.07)',
        borderWidth: 2,
        borderColor: 'rgba(242,228,201,0.16)',
        borderRadius: 20,
        padding: 16,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <Text
          style={{
            flex: 1,
            fontFamily: tokens.type.uiBold,
            fontSize: 10.5,
            color: 'rgba(242,228,201,0.45)',
            letterSpacing: 2,
          }}
        >
          {match.winnerIndex === null ? 'DRAW' : 'DUEL RESULT'} · {dateLabel}
        </Text>
        <Pressable onPress={onShare} hitSlop={8}>
          <View
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              backgroundColor: color.brass,
              borderWidth: 2,
              borderColor: color.ink,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShareIcon size={14} tint={color.ink} />
          </View>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <PlayerColumn player={a} isWinner={match.winnerIndex === 0} isDraw={match.winnerIndex === null} />
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 12, color: 'rgba(242,228,201,0.4)' }}>VS</Text>
        </View>
        <PlayerColumn player={b} isWinner={match.winnerIndex === 1} isDraw={match.winnerIndex === null} />
      </View>
    </View>
  );
}

function PlayerColumn({
  player,
  isWinner,
  isDraw,
}: {
  player: DuelHistoryPlayer;
  isWinner: boolean;
  isDraw: boolean;
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: player.color }} />
        <Text
          style={{
            fontFamily: tokens.type.uiExtraBold,
            fontSize: 13,
            color: isWinner ? player.color : color.textOnDark,
            letterSpacing: 0.5,
          }}
          numberOfLines={1}
        >
          {player.name.toUpperCase()}
        </Text>
        {isWinner && (
          <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 11 }}>👑</Text>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: 4 }}>
        {player.code.map((d, i) => (
          <View
            key={i}
            style={{
              width: 24,
              height: 30,
              backgroundColor: color.vaultCream,
              borderWidth: 2,
              borderColor: color.ink,
              borderRadius: 7,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: tokens.type.display, fontSize: 14, color: color.ink }}>{d}</Text>
          </View>
        ))}
      </View>

      <Text
        style={{
          fontFamily: tokens.type.uiBold,
          fontSize: 10.5,
          color: 'rgba(242,228,201,0.5)',
          letterSpacing: 1,
          marginTop: 7,
        }}
      >
        {isDraw ? `${player.attempts} TRIES · OUT` : isWinner ? `CRACKED IN ${player.attempts}` : `${player.attempts} TRIES`}
      </Text>
    </View>
  );
}
