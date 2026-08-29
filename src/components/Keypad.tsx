import React from 'react';
import { Text, View } from 'react-native';
import { ShadowButton } from './ShadowButton';
import { DeleteIcon } from '../icons';
import { tokens } from '../theme/tokens';

const { color } = tokens;

export function Keypad({
  onKey,
  onDel,
  onSubmit,
  canSubmit,
  submitLabel = 'CRACK',
}: {
  onKey: (n: number) => void;
  onDel: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
  /** Defaults to "CRACK" (guessing); pass e.g. "LOCK IT IN" when this pad is used to set a secret instead. */
  submitLabel?: string;
}) {
  const keyStyle = {
    paddingVertical: 13,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <View key={n} style={{ width: '31.4%' }}>
          <ShadowButton bg={color.vaultCream} edgeColor={color.creamEdge} radius={15} edgeDepth={5} style={keyStyle} onPress={() => onKey(n)} sound="key">
            <Text style={{ fontFamily: tokens.type.display, fontSize: 22, color: color.ink }}>{n}</Text>
          </ShadowButton>
        </View>
      ))}
      <View style={{ width: '31.4%' }}>
        <ShadowButton bg={color.deleteKeyBg} edgeColor={color.deleteKeyEdge} radius={15} edgeDepth={5} style={keyStyle} onPress={onDel} sound="delete">
          <DeleteIcon size={30} />
        </ShadowButton>
      </View>
      <View style={{ width: '31.4%' }}>
        <ShadowButton bg={color.vaultCream} edgeColor={color.creamEdge} radius={15} edgeDepth={5} style={keyStyle} onPress={() => onKey(0)} sound="key">
          <Text style={{ fontFamily: tokens.type.display, fontSize: 22, color: color.ink }}>0</Text>
        </ShadowButton>
      </View>
      <View style={{ width: '31.4%' }}>
        <ShadowButton
          bg={canSubmit ? color.coral : '#8A5A4C'}
          edgeColor={canSubmit ? color.coralEdge : '#5E3A30'}
          radius={15}
          edgeDepth={5}
          style={keyStyle}
          onPress={onSubmit}
          sound="submit"
        >
          <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 16, color: '#fff', letterSpacing: 1 }}>
            {submitLabel}
          </Text>
        </ShadowButton>
      </View>
    </View>
  );
}
