import React from 'react';
import { Pressable, View } from 'react-native';
import { tokens } from '../theme/tokens';
import { playSound } from '../audio/sounds';

const { color: palette } = tokens;

export function ColorSwatchPicker({
  colors,
  selected,
  disabledColors = [],
  onSelect,
}: {
  colors: string[];
  selected: string;
  /** Colors another player has already taken — shown dimmed and untappable. */
  disabledColors?: string[];
  onSelect: (color: string) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {colors.map((c) => {
        const isSelected = c === selected;
        const isDisabled = disabledColors.includes(c) && !isSelected;
        return (
          <Pressable
            key={c}
            disabled={isDisabled}
            onPress={() => {
              playSound('tap');
              onSelect(c);
            }}
            style={{ opacity: isDisabled ? 0.25 : 1 }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: c,
                borderWidth: isSelected ? 4 : 3,
                borderColor: isSelected ? palette.textOnDark : palette.ink,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isSelected && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: palette.ink,
                  }}
                />
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
