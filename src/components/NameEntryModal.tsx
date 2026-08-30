import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import { ShadowButton } from './ShadowButton';
import { ColorSwatchPicker } from './ColorSwatchPicker';
import { tokens } from '../theme/tokens';

const { color } = tokens;

/**
 * Themed replacement for a bare `Alert.prompt` — collects a duel player's
 * name and color as a modal card in app colors, on top of a dimmed backdrop.
 * Keeps the underlying code-entry screen free to show only the digit dial.
 */
export function NameEntryModal({
  visible,
  playerLabel,
  name,
  onChangeName,
  colors,
  selectedColor,
  disabledColors = [],
  onSelectColor,
  onConfirm,
}: {
  visible: boolean;
  playerLabel: string;
  name: string;
  onChangeName: (v: string) => void;
  colors: string[];
  selectedColor: string;
  disabledColors?: string[];
  onSelectColor: (c: string) => void;
  onConfirm: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // Without this, Android's "height" behavior shrinks the view by the full
        // status bar + keyboard height on top of `statusBarTranslucent`, pushing
        // the card up further than needed instead of just clearing the keyboard.
        keyboardVerticalOffset={Platform.OS === 'android' ? -(StatusBar.currentHeight ?? 0) : 0}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: 'rgba(11,34,36,0.78)' }}
          contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              width: '100%',
              maxWidth: 380,
              backgroundColor: color.vaultCream,
              borderWidth: 3.5,
              borderColor: color.ink,
              borderRadius: 26,
              padding: 22,
            }}
          >
            <Text
              style={{
                fontFamily: tokens.type.uiBold,
                fontSize: 11,
                color: color.brassEdge,
                letterSpacing: 3,
                textAlign: 'center',
              }}
            >
              {playerLabel}
            </Text>
            <Text
              style={{
                fontFamily: tokens.type.display,
                fontSize: 20,
                color: color.ink,
                textAlign: 'center',
                marginTop: 4,
                marginBottom: 18,
              }}
            >
              WHO'S PLAYING?
            </Text>

            <Text
              style={{
                fontFamily: tokens.type.uiBold,
                fontSize: 11,
                color: color.brownMuted,
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              YOUR NAME
            </Text>
            <TextInput
              value={name}
              onChangeText={onChangeName}
              placeholder={playerLabel === 'PLAYER 1' ? 'Player 1' : 'Player 2'}
              placeholderTextColor="rgba(11,34,36,0.4)"
              maxLength={16}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={onConfirm}
              style={{
                backgroundColor: color.creamBright,
                borderWidth: 3,
                borderColor: color.ink,
                borderRadius: 14,
                paddingVertical: 12,
                paddingHorizontal: 16,
                fontFamily: tokens.type.uiSemiBold,
                fontSize: 16,
                color: color.ink,
                marginBottom: 18,
              }}
            />

            <Text
              style={{
                fontFamily: tokens.type.uiBold,
                fontSize: 11,
                color: color.brownMuted,
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              YOUR COLOR
            </Text>
            <ColorSwatchPicker colors={colors} selected={selectedColor} disabledColors={disabledColors} onSelect={onSelectColor} />

            <View style={{ marginTop: 22 }}>
              <ShadowButton
                bg={color.coral}
                edgeColor={color.coralEdge}
                radius={18}
                edgeDepth={6}
                style={{ paddingVertical: 16, alignItems: 'center' }}
                onPress={onConfirm}
              >
                <Text style={{ fontFamily: tokens.type.uiExtraBold, fontSize: 16, color: '#fff', letterSpacing: 1 }}>
                  CONTINUE
                </Text>
              </ShadowButton>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
