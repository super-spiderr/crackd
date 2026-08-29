import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { tokens } from '../theme/tokens';
import { perDigitFeedback, type DigitFeedback } from '../engine/score';
import { playSound } from '../audio/sounds';

const { color } = tokens;

/**
 * Post-game recap of every attempt against a now-revealed secret. Unlike the
 * live GuessRow (which only shows exact/misplaced *counts*, by Mastermind
 * design — see `perDigitFeedback`), this colors each guessed digit itself,
 * so once the round is over a player can see exactly which digits and
 * positions they had wrong.
 *
 * Opens as a bottom sheet rather than expanding inline — the Lose/duel-result
 * screens it lives on have a fixed layout (illustrations, buttons pinned to
 * the bottom), so pushing content around when expanded would jostle them.
 */
export function AttemptReview({
  secret,
  guesses,
  label = 'REVIEW YOUR ATTEMPTS',
  accentColor = color.brass,
}: {
  secret: number[];
  guesses: { digits: number[] }[];
  label?: string;
  accentColor?: string;
}) {
  const [open, setOpen] = useState(false);
  if (guesses.length === 0) return null;

  return (
    <>
      <Pressable
        onPress={() => {
          playSound('tap');
          setOpen(true);
        }}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 7,
          paddingVertical: 6,
        }}
      >
        <Text style={{ fontFamily: tokens.type.uiBold, fontSize: 12, color: accentColor, letterSpacing: 1.5 }}>
          {label} ({guesses.length})
        </Text>
        <Text style={{ fontFamily: tokens.type.uiBold, fontSize: 12, color: accentColor }}>▾</Text>
      </Pressable>

      <ReviewSheet
        visible={open}
        onClose={() => setOpen(false)}
        title={label}
        secret={secret}
        guesses={guesses}
        accentColor={accentColor}
      />
    </>
  );
}

function ReviewSheet({
  visible,
  onClose,
  title,
  secret,
  guesses,
  accentColor,
}: {
  visible: boolean;
  onClose: () => void;
  title: string;
  secret: number[];
  guesses: { digits: number[] }[];
  accentColor: string;
}) {
  const insets = useSafeAreaInsets();
  const { height: windowH } = useWindowDimensions();
  const secretStr = secret.join('');

  return (
    <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(11,34,36,0.6)', justifyContent: 'flex-end' }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            maxHeight: windowH * 0.72,
            backgroundColor: color.bgDeep,
            borderTopLeftRadius: 26,
            borderTopRightRadius: 26,
            borderWidth: 3,
            borderBottomWidth: 0,
            borderColor: color.ink,
            paddingTop: 10,
            paddingHorizontal: 18,
            paddingBottom: insets.bottom + 18,
          }}
        >
          <View
            style={{
              alignSelf: 'center',
              width: 40,
              height: 5,
              borderRadius: 3,
              backgroundColor: 'rgba(242,228,201,0.25)',
              marginBottom: 14,
            }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
            <Text
              style={{
                flex: 1,
                fontFamily: tokens.type.uiExtraBold,
                fontSize: 15,
                color: accentColor,
                letterSpacing: 1,
              }}
            >
              {title}
            </Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={{ fontFamily: tokens.type.uiBold, fontSize: 13, color: 'rgba(242,228,201,0.55)', letterSpacing: 1 }}>
                DONE
              </Text>
            </Pressable>
          </View>

          <Legend />

          <ScrollView contentContainerStyle={{ gap: 6, paddingBottom: 4 }} showsVerticalScrollIndicator={false}>
            {guesses.map((g, i) => (
              <ReviewRow key={i} n={i + 1} tags={perDigitFeedback(secretStr, g.digits.join(''))} digits={g.digits} />
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function Legend() {
  return (
    <View style={{ flexDirection: 'row', gap: 14, justifyContent: 'center', marginBottom: 14 }}>
      <LegendItem state="exact" text="right spot" />
      <LegendItem state="misplaced" text="wrong spot" />
      <LegendItem state="dead" text="not in code" />
    </View>
  );
}

function LegendItem({ state, text }: { state: DigitFeedback; text: string }) {
  const s = cellStyle(state);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View
        style={{
          width: 12,
          height: 12,
          borderRadius: 4,
          backgroundColor: s.bg,
          borderWidth: 1.5,
          borderColor: s.border,
        }}
      />
      <Text style={{ fontFamily: tokens.type.uiMedium, fontSize: 10, color: 'rgba(242,228,201,0.55)' }}>{text}</Text>
    </View>
  );
}

function ReviewRow({ n, digits, tags }: { n: number; digits: number[]; tags: DigitFeedback[] }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(242,228,201,0.05)',
        borderRadius: 12,
        paddingVertical: 6,
        paddingHorizontal: 8,
      }}
    >
      <Text style={{ fontFamily: tokens.type.uiBold, fontSize: 11, color: 'rgba(242,228,201,0.4)', width: 20 }}>
        #{n}
      </Text>
      {digits.map((d, i) => {
        const s = cellStyle(tags[i]);
        return (
          <View
            key={i}
            style={{
              width: 26,
              height: 31,
              borderRadius: 8,
              backgroundColor: s.bg,
              borderWidth: 2,
              borderColor: s.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontFamily: tokens.type.display, fontSize: 14, color: s.text }}>{d}</Text>
          </View>
        );
      })}
    </View>
  );
}

function cellStyle(state: DigitFeedback): { bg: string; border: string; text: string } {
  if (state === 'exact') return { bg: color.exact, border: color.exactEdge, text: color.ink };
  if (state === 'misplaced') return { bg: 'transparent', border: color.misplaced, text: color.textOnDark };
  return { bg: color.dead, border: color.deadBorder, text: 'rgba(242,228,201,0.5)' };
}
